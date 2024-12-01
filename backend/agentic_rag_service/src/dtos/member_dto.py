import uuid
from dataclasses import dataclass, field
from datetime import date

@dataclass
class MemberDTO:
    memberName: str
    email: str
    role:str
    yearsOfExperience:int
    memberId: str = field(default_factory=lambda: str(uuid.uuid4()))
    createdDate: date = field(default_factory=date.today)
