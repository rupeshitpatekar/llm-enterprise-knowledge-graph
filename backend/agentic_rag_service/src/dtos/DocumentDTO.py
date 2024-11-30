import uuid
from dataclasses import dataclass, field
from datetime import date

from neo4j.time import DateTime


@dataclass
class DocumentDTO:

    documentName: str
    author: str
    lastModifiedDate: date
    version: float
    summary: str
    createdDate: date = field(default_factory=date.today)
    documentId: str = field(default_factory=lambda: str(uuid.uuid4()))


