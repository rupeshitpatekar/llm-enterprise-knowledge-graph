from typing import List, Dict
import numpy as np
from langchain.prompts import PromptTemplate
from langchain.chains import LLMChain
from core.agent_types import AgentResult, AgentType


class ResultAggregator:
    def __init__(self, llm):
        self.llm = llm
        self.setup_aggregation_chain()

    def setup_aggregation_chain(self):
        template = """
        Analyze and synthesize the following agent responses into a coherent final response.
        Each response provides a different perspective on the query.

        Query: {query}

        Researcher's findings:
        {researcher_response}

        Analyzer's insights:
        {analyzer_response}

        Fact Checker's verification:
        {fact_checker_response}

        Summarizer's overview:
        {summarizer_response}

        Please provide:
        1. A comprehensive answer that combines all perspectives
        2. Key points of agreement and disagreement between agents
        3. Any additional insights from comparing the different responses
        4. Citations and sources mentioned by the agents

        Final synthesized response:
        """

        self.prompt = PromptTemplate(
            template=template,
            input_variables=["query", "researcher_response", "analyzer_response",
                             "fact_checker_response", "summarizer_response"]
        )

        self.chain = LLMChain(llm=self.llm, prompt=self.prompt)

    def aggregate_results(self, query: str, results: List[AgentResult]) -> Dict:
        # Organize results by agent type
        results_by_type = {result.agent_type: result for result in results}

        # Prepare inputs for the aggregation chain
        chain_inputs = {
            "query": query,
            "researcher_response": results_by_type[AgentType.RESEARCHER].response,
            "analyzer_response": results_by_type[AgentType.ANALYZER].response,
            "fact_checker_response": results_by_type[AgentType.FACT_CHECKER].response,
            "summarizer_response": results_by_type[AgentType.SUMMARIZER].response
        }

        # Generate aggregated response
        aggregated = self.chain.run(**chain_inputs)

        # Collect all sources
        all_sources = []
        for result in results:
            all_sources.extend(result.sources)

        # Calculate average confidence
        avg_confidence = np.mean([result.confidence for result in results])

        # Calculate average execution time
        avg_execution_time = np.mean([result.execution_time for result in results])

        return {
            "aggregated_response": aggregated,
            "sources": list(set(all_sources)),
            "confidence": avg_confidence,
            "execution_time": avg_execution_time,
            "individual_responses": [
                result.to_dict() for result in results
            ]
        }