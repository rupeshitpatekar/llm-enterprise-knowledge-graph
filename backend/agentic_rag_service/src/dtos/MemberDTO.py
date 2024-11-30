import uuid
from dataclasses import dataclass, field


@dataclass
class MemberDTO:
    memberName: str
    email: str
    phone:int
    department: str
    role:str
    yearsOfExperience:int
    acheivements:str
    memberId: str = field(default_factory=lambda: str(uuid.uuid4()))
