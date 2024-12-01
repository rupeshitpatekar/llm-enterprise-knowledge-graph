import uuid
from dataclasses import dataclass, field
from datetime import date

@dataclass
class DocumentDTO:
    documentName: str
    author: str
    version: float
    summary: str
    type: str
    createdDate: date = field(default_factory=date.today)
    lastModifiedDate: date = field(default_factory=date.today)
    documentId: str = field(default_factory=lambda: str(uuid.uuid4()))


