from nameko.rpc import rpc
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

from shared.dtos.project_dto import ProjectDTO
from shared.dtos.activities_dto import ActivityDTO
from shared.dtos.document_dto import DocumentDTO
from shared.dtos.member_dto import MemberDTO
from services.feedback_agent import FeedbackAgent
from services.generator_agent import GeneratorAgentService
from services.retriever_agent import RetrieverAgentService
from neo4j import GraphDatabase, basic_auth

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
        #self.llm = OpenAI(temperature=0.5, model_name="text-davinci-003", api_key=self.api_key)
        #self.embeddings = OpenAIEmbeddings()
        #self.vectorstore = FAISS.load_local("path/to/vectorstore", self.embeddings)
        #self.retriever = self.vectorstore.as_retriever()

        # Create a RetrievalQA chain using Langchain
        #self.qa_chain = RetrievalQA.from_chain_type(llm=self.llm, retriever=self.retriever)
        # Initialize the cache
        #self.landchainCache = Cache()

        # Initialize the Neo4j driver
        neo4j_auth = os.getenv("NEO4J_AUTH")
        neo4j_uri = os.getenv("NEO4J_URI")
        if not neo4j_auth:
            raise ValueError("NEO4J_AUTH environment variable is not set")
        neo4j_user, neo4j_password = neo4j_auth.split('/')
        self.driver = GraphDatabase.driver(neo4j_uri, auth=basic_auth(neo4j_user, neo4j_password))

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
    #def generate_llm_output_using_langchain(self, user_message):
    #    logger.info(f"Generating LLM output for user message using Langchain with custom prompt: {user_message}")
    #    try:
    #        # Define a custom prompt template
    #        custom_prompt = f"Based on the following context, answer the question:\n\nContext: {{context}}\n\nQuestion: {{query}}\n\nAnswer:"

            # Combine agents into a composite chain
    #        composite_chain = SequentialChain(chains=[self.qa_chain])

            # Use Langchain chain with the custom prompt to retrieve context and generate response
    #        result = composite_chain({"query": user_message, "prompt": custom_prompt})
            #result = self.qa_chain({"query": user_message, "prompt": custom_prompt})
    #        context = result.get("context")
    #        response = result.get("result")
    #        return {"context": context, "response": response}
    #    except Exception as e:
    #        logger.error(f"Error generating LLM output: {e}")
    #        return {"error": str(e)}

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

    @rpc
    def create_project(self, project_data):
        try:
            project_dto = ProjectDTO(**project_data)
            with self.driver.session() as session:
                session.write_transaction(self._create_project_transaction, project_dto)
                return {"response": "Project created successfully"}
        except Exception as e:
            logger.error(f"Error creating project: {e}")
            return {"status": "error", "message": str(e)}

    @staticmethod
    def _create_project_transaction(tx, project: ProjectDTO):
        # Create Project Node
        tx.run(
            "CREATE (p:Project {projectId: $projectId, projectName: $projectName, description: $description, "
            "startDate: $startDate, endDate: $endDate, budget: $budget, status: $status, "
            "projectIndustry: $projectIndustry, assets: $assets, benefits: $benefits})",
            projectId=project.projectId,
            projectName=project.projectName,
            description=project.description,
            startDate=project.startDate,
            endDate=project.endDate,
            budget=project.budget,
            status=project.status,
            projectIndustry=project.projectIndustry,
            assets=project.assets,
            benefits=project.benefits
        )

        # Create Activities and Relationships
        for activity_data in project.activities:
            activity = ActivityDTO(**activity_data)
            tx.run(
                "CREATE (a:Activity {activityId: $activityId, activityName: $activityName, startDate: $startDate, "
                "endDate: $endDate, status: $status})",
                activityId=activity.activityId,
                activityName=activity.activityName,
                startDate=activity.startDate,
                endDate=activity.endDate,
                status=activity.status
            )
            tx.run(
                "MATCH (p:Project {projectId: $projectId}), (a:Activity {activityId: $activityId}) "
                "CREATE (p)-[:HAS_ACTIVITY]->(a)",
                projectId=project.projectId,
                activityId=activity.activityId
            )

        # Create Documents and Relationships
        for document_data in project.documents:
            document = DocumentDTO(**document_data)
            tx.run(
                "CREATE (d:Document {documentId: $documentId, documentName: $documentName, type: $type, "
                "createdDate: $createdDate})",
                documentId=document.documentId,
                documentName=document.documentName,
                type=document.type,
                createdDate=document.createdDate
            )
            tx.run(
                "MATCH (p:Project {projectId: $projectId}), (d:Document {documentId: $documentId}) "
                "CREATE (p)-[:HAS_DOCUMENT]->(d)",
                projectId=project.projectId,
                documentId=document.documentId
            )

        # Create Members and Relationships
        for member_data in project.members:
            member = MemberDTO(**member_data)
            tx.run(
                "CREATE (m:Member {memberId: $memberId, name: $name, role: $role, startDate: $startDate})",
                memberId=member.memberId,
                name=member.name,
                role=member.role,
                startDate=member.startDate
            )
            tx.run(
                "MATCH (p:Project {projectId: $projectId}), (m:Member {memberId: $memberId}) "
                "CREATE (p)-[:HAS_MEMBER]->(m)",
                projectId=project.projectId,
                memberId=member.memberId
            )

    @rpc
    def get_projects(self):
        try:
            with self.driver.session() as session:
                result = session.read_transaction(self._get_projects_transaction)
                return result
        except Exception as e:
            logger.error(f"Error retrieving projects: {e}")
            return {"status": "error", "message": str(e)}

    @staticmethod
    def _get_projects_transaction(tx):
        query = """
        MATCH (p:Project)
        OPTIONAL MATCH (p)-[:HAS_ACTIVITY]->(a:Activity)
        OPTIONAL MATCH (p)-[:HAS_DOCUMENT]->(d:Document)
        OPTIONAL MATCH (p)-[:HAS_MEMBER]->(m:Member)
        RETURN p, collect(a) as activities, collect(d) as documents, collect(m) as members
        """
        result = tx.run(query)
        projects = []
        for record in result:
            project = record["p"]
            activities = record["activities"]
            documents = record["documents"]
            members = record["members"]
            projects.append({
                "projectId": project["projectId"],
                "projectName": project["projectName"],
                "description": project["description"],
                "startDate": project["startDate"],
                "endDate": project["endDate"],
                "budget": project["budget"],
                "status": project["status"],
                "projectIndustry": project["projectIndustry"],
                "assets": project["assets"],
                "benefits": project["benefits"],
                "activities": [
                    {
                        "activityId": activity["activityId"],
                        "activityName": activity["activityName"],
                        "startDate": activity["startDate"],
                        "endDate": activity["endDate"],
                        "status": activity["status"],
                        "author": activity["author"]
                    } for activity in activities
                ],
                "documents": [
                    {
                        "documentId": document["documentId"],
                        "documentName": document["documentName"],
                        "type": document["type"],
                        "createdDate": document["createdDate"]
                    } for document in documents
                ],
                "members": [
                    {
                        "memberId": member["memberId"],
                        "name": member["name"],
                        "role": member["role"],
                        "startDate": member["startDate"]
                    } for member in members
                ]
            })
        return projects