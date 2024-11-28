from typing import Dict
from langchain.agents import Tool, AgentExecutor, OpenAIFunctionsAgent
from langchain.schema.messages import SystemMessage
from langchain.memory import ConversationBufferMemory
from core.agent_types import AgentType, AgentPrompts


class AgentFactory:
    @staticmethod
    def create_agent(agent_type: AgentType, llm, vector_store_rpc):
        system_message = SystemMessage(
            content=getattr(AgentPrompts, agent_type.value.upper())
        )

        tools = [
            Tool(
                name="Search Documents",
                func=vector_store_rpc.query,
                description="Search through the document collection"
            )
        ]

        agent = OpenAIFunctionsAgent(
            llm=llm,
            tools=tools,
            system_message=system_message
        )

        memory = ConversationBufferMemory(
            memory_key="chat_history",
            return_messages=True
        )

        return AgentExecutor(
            agent=agent,
            tools=tools,
            memory=memory,
            verbose=True
        )