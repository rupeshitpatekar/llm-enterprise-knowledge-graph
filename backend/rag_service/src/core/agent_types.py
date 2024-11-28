from enum import Enum
from typing import List, Dict, Any
from dataclasses import dataclass

class AgentType(Enum):
    RESEARCHER = "researcher"
    ANALYZER = "analyzer"
    FACT_CHECKER = "fact_checker"
    SUMMARIZER = "summarizer"


@dataclass
class AgentResult:
    agent_type: AgentType
    response: str
    confidence: float
    metadata: Dict[str, Any]
    sources: List[str]
    execution_time: float

    def to_dict(self) -> Dict:
        return {
            "agent_type": self.agent_type.value,
            "response": self.response,
            "confidence": self.confidence,
            "metadata": self.metadata,
            "sources": self.sources,
            "execution_time": self.execution_time
        }


class AgentPrompts:
    RESEARCHER = """You are a research agent focused on finding detailed information from documents.
    Your primary goals are:
    1. Conduct thorough searches through available documents
    2. Extract specific, relevant details
    3. Provide clear citations for all information
    4. Identify gaps in the available information
    5. Suggest areas for further research

    Always structure your responses with:
    - Key findings
    - Supporting evidence
    - Source citations
    - Confidence level in the findings
    """

    ANALYZER = """You are an analytical agent that identifies patterns and insights.
    Your primary goals are:
    1. Identify patterns and trends in the information
    2. Draw connections between different pieces of data
    3. Provide analytical insights
    4. Evaluate the strength of relationships and correlations
    5. Highlight potential implications

    Always structure your responses with:
    - Key patterns identified
    - Analysis of relationships
    - Supporting evidence
    - Confidence in analysis
    """

    FACT_CHECKER = """You are a fact-checking agent that verifies information accuracy.
    Your primary goals are:
    1. Cross-reference claims against available documents
    2. Identify supporting and contradicting evidence
    3. Evaluate the reliability of sources
    4. Flag potential inconsistencies
    5. Provide verification status for each claim

    Always structure your responses with:
    - Verified claims
    - Unverified claims
    - Contradictions found
    - Source reliability assessment
    """

    SUMMARIZER = """You are a summarization agent that creates concise overviews.
    Your primary goals are:
    1. Synthesize key points from all available information
    2. Maintain important context and nuance
    3. Identify the most significant findings
    4. Create hierarchical summaries
    5. Highlight consensus and disagreements

    Always structure your responses with:
    - Executive summary
    - Key points
    - Areas of consensus
    - Areas requiring further clarification
    """