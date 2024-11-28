from nameko.rpc import rpc, RpcProxy
from nameko_redis import Redis
import logging
import openai
import os
import dotenv
import json
from langchain import OpenAI, FAISS
from langchain.chains import RetrievalQA
from langchain.embeddings import OpenAIEmbeddings
from langchain.chains import SequentialChain
from services.feedback_agent import FeedbackAgent
from services.generator_agent import GeneratorAgentService
from services.retriever_agent import RetrieverAgentService

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class AgenticRAGService:
    name = "agentic_rag_service"
    
    redis_client = Redis('development')

    def __init__(self):
        dotenv.load_dotenv()
        self.endpoint = os.environ.get("AZURE_OPENAI_ENDPOINT")
        self.api_key = os.environ.get("AZURE_OPENAI_API_KEY")
        self.deployment = os.environ.get("AZURE_OPENAI_DEPLOYMENT_ID")
        self.client = openai.AzureOpenAI(
            azure_endpoint=self.endpoint,
            api_key=self.api_key,
            api_version="2024-02-01",
        )
        # Initialize Langchain components
        self.llm = OpenAI(temperature=0.5, model_name="text-davinci-003", api_key=self.api_key)
        self.embeddings = OpenAIEmbeddings()
        self.vectorstore = FAISS.load_local("path/to/vectorstore", self.embeddings)
        self.retriever = self.vectorstore.as_retriever()

        # Create a RetrievalQA chain using Langchain
        self.qa_chain = RetrievalQA.from_chain_type(llm=self.llm, retriever=self.retriever)
        # Initialize the cache
        self.landchainCache = Cache()

    @rpc
    def generate_agentic_llm_output(self, user_message):
        logger.info(f"Generating LLM output for user message using sequential chain: {user_message}")
        try:
            cache_key = f"response:{user_message}"
            cached_response = self.redis_client.get(cache_key)
            if cached_response:
                logger.info("Cache hit for response")
                return cached_response

            documents = RetrieverAgentService.retrieve_documents(user_message, top_k=3)
            context = " ".join([doc["text"] for doc in documents])

            # Truncate context to fit within the token limit
            max_context_length = 8192 - len(user_message) - 1000  # Reserve tokens for prompt and response
            truncated_context = context[:max_context_length]

            response = GeneratorAgentService.generate_llm_output(user_message, truncated_context)
            self.redis_client.set(cache_key, json.dumps({"response": response, "context": truncated_context}), ex=3600)  # Cache for 1 hour
            return {"response": response, "context": truncated_context}
        except openai.error.InvalidRequestError as e:
            logger.error(f"Invalid request error: {e}")
            return {"error": "Invalid request. Please check the endpoint URL, deployment ID, and API version."}
        except Exception as e:
            logger.error(f"Error in Agentic RAG Service: {e}")
            return {"error": str(e)}

    @rpc
    def generate_llm_output_using_langchain(self, user_message):
        logger.info(f"Generating LLM output for user message using Langchain with custom prompt: {user_message}")
        try:
            # Define a custom prompt template
            custom_prompt = f"Based on the following context, answer the question:\n\nContext: {{context}}\n\nQuestion: {{query}}\n\nAnswer:"

            # Combine agents into a composite chain
            composite_chain = SequentialChain(chains=[self.qa_chain])

            # Use Langchain chain with the custom prompt to retrieve context and generate response
            result = composite_chain({"query": user_message, "prompt": custom_prompt})
            #result = self.qa_chain({"query": user_message, "prompt": custom_prompt})
            context = result.get("context")
            response = result.get("result")
            return {"context": context, "response": response}
        except Exception as e:
            logger.error(f"Error generating LLM output: {e}")
            return {"error": str(e)}

    @rpc
    def store_feedback(self, user_message, context, response, feedback):
        try:
            return FeedbackAgent.store_feedback(self.redis_client, user_message, context, response, feedback)
        except Exception as e:
            logger.error(f"Error storing feedback: {e}")
            return {"status": "error", "message": str(e)}

    @rpc
    def analyze_feedback(self):
        try:
            return FeedbackAgent.analyze_feedback(self.redis_client)
        except Exception as e:
            logger.error(f"Error analyzing feedback: {e}")
            return {"status": "error", "message": str(e)}

    @rpc
    def improve_system(self):
        try:
            return FeedbackAgent.improve_system(self.redis_client)
        except Exception as e:
            logger.error(f"Error improving system: {e}")
            return {"status": "error", "message": str(e)}