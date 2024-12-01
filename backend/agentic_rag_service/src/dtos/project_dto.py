import uuid
from dataclasses import dataclass, field
from datetime import date
from typing import List

from dtos.activities_dto import ActivityDTO
from dtos.document_dto import DocumentDTO
from dtos.member_dto import MemberDTO


@dataclass
class ProjectDTO:
    projectName: str
    description: str
    startDate: str
    endDate: str
    budget: int
    status: str
    projectIndustry: str
    assets: str
    benefits: str
    activities: List[ActivityDTO]
    documents: List[DocumentDTO]
    members: List[MemberDTO]
    projectId: str = field(default_factory=lambda: str(uuid.uuid4()))
    createdDate: date = field(default_factory=date.today)