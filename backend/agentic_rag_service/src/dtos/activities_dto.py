import uuid
from dataclasses import dataclass, field
from datetime import date

@dataclass
class ActivityDTO:
    activityName: str
    startDate: str
    endDate: str
    status: str
    activityId: str = field(default_factory=lambda: str(uuid.uuid4()))
    createdDate: date = field(default_factory=date.today)