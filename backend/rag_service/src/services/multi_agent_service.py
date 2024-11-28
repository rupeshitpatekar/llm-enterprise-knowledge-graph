from nameko.rpc import RpcProxy
from nameko.web.handlers import http
import json
import asyncio
from concurrent.futures import ThreadPoolExecutor
import time
from typing import List, Dict
from prometheus_client import Counter, Histogram
from core.llm_providers import AzureOpenAIProvider, AWSBedrockProvider
from config.settings import settings
from services.agent_factory import AgentFactory
from services.result_aggregator import ResultAggregator

from agentic_rag_service.src.core.agent_types import AgentType, AgentResult


class MultiAgentService:
    name = "multi_agent"
    vector_store_rpc = RpcProxy("vector_store")

    # Metrics
    query_counter = Counter('multi_agent_queries_total', 'Total number of multi-agent queries')
    query_latency = Histogram('multi_agent_query_duration_seconds', 'Multi-agent query duration')
    agent_errors = Counter('multi_agent_errors_total', 'Total number of agent errors', ['agent_type'])

    def __init__(self):
        self.setup_llm_provider()
        self.setup_agents()
        self.executor = ThreadPoolExecutor(max_workers=settings.MAX_WORKERS)
        self.result_aggregator = ResultAggregator(self.llm)

    def setup_llm_provider(self):
        provider_type = settings.LLM_PROVIDER.lower()

        if provider_type == "azure":
            self.llm_provider = AzureOpenAIProvider()
        elif provider_type == "bedrock":
            self.llm_provider = AWSBedrockProvider()
        else:
            raise ValueError(f"Unsupported LLM provider: {provider_type}")

        if not self.llm_provider.health_check():
            raise Exception(f"LLM provider {provider_type} health check failed")

        self.llm = self.llm_provider.get_llm()

    def setup_agents(self):
        self.agents = {
            agent_type: AgentFactory.create_agent(agent_type, self.llm, self.vector_store_rpc)
            for agent_type in AgentType
        }

    async def process_query_async(self, query: str) -> Dict:
        start_time = time.time()
        self.query_counter.inc()

        loop = asyncio.get_event_loop()
        tasks = []

        for agent_type in AgentType:
            task = loop.run_in_executor(
                self.executor,
                self.process_with_agent,
                agent_type,
                query
            )
            tasks.append(task)

        results = await asyncio.gather(*tasks)
        aggregated_results = self.result_aggregator.aggregate_results(query, results)

        execution_time = time.time() - start_time
        self.query_latency.observe(execution_time)

        return {
            "success": True,
            "results": aggregated_results,
            "metadata": {
                "execution_time": execution_time,
                "agent_count": len(results),
                "query_timestamp": str(time.time())
            }
        }

    def process_with_agent(self, agent_type: AgentType, query: str) -> AgentResult:
        start_time = time.time()
        try:
            agent = self.agents[agent_type]
            response = agent.invoke({"input": query})

            execution_time = time.time() - start_time

            return AgentResult(
                agent_type=agent_type,
                response=response["output"],
                confidence=self.calculate_confidence(response),
                metadata={"timestamp": str(time.time())},
                sources=self.extract_sources(response["output"]),
                execution_time=execution_time
            )
        except Exception as e:
            self.agent_errors.labels(agent_type.value).inc()
            return AgentResult(
                agent_type=agent_type,
                response=f"Error: {str(e)}",
                confidence=0.0,
                metadata={"error": str(e)},
                sources=[],
                execution_time=time.time() - start_time
            )

    def calculate_confidence(self, response: Dict) -> float:
        # Implement custom confidence calculation logic
        return 0.8

    def extract_sources(self, response: str) -> List[str]:
        # Implement source extraction logic based on your response format
        sources = []
        if "Source:" in response:
            sources = [src.strip() for src in response.split("Source:")[1:]]
        return sources

    @http('POST', '/query')
    def handle_query(self, request):
        try:
            data = json.loads(request.get_data(as_text=True))
            query = data.get('query')

            if not query:
                return 400, "Query parameter is required"

            response = asyncio.run(self.process_query_async(query))

            return 200, json.dumps(response)
        except Exception as e:
            return 500, json.dumps({"error": str(e)})