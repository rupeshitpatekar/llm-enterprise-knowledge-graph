import uuid
from datetime import date
from backend.agentic_rag_service.src import Neo4jApp

class DocumentEntity:
    def __init__(self, documentName, author, lastModifiedDate, version, summary, createdDate=None, documentId=None):
        self.documentName = documentName
        self.author = author
        self.lastModifiedDate = lastModifiedDate
        self.version = version
        self.summary = summary
        self.createdDate = createdDate or date.today()
        self.documentId = documentId or str(uuid.uuid4())

    def save(self, app: Neo4jApp):
        query = """
        CREATE (d:Document {
            documentName: $documentName,
            author: $author,
            lastModifiedDate: $lastModifiedDate,
            version: $version,
            summary: $summary,
            createdDate: $createdDate,
            documentId: $documentId
        })
        RETURN d
        """
        parameters = {
            "documentName": self.documentName,
            "author": self.author,
            "lastModifiedDate": self.lastModifiedDate.isoformat(),
            "version": self.version,
            "summary": self.summary,
            "createdDate": self.createdDate.isoformat(),
            "documentId": self.documentId
        }
        return app.run_query(query, parameters)

    @staticmethod
    def find_by_name(app: Neo4jApp, documentName):
        query = """
        MATCH (d:Document {documentName: $documentName})
        RETURN d
        """
        parameters = {"documentName": documentName}
        result = app.run_query(query, parameters)
        if result:
            record = result[0]["d"]
            return DocumentEntity(
                documentName=record["documentName"],
                author=record["author"],
                lastModifiedDate=date.fromisoformat(record["lastModifiedDate"]),
                version=record["version"],
                summary=record["summary"],
                createdDate=date.fromisoformat(record["createdDate"]),
                documentId=record["documentId"]
            )
        return None

    @classmethod
    def find_by_id(cls, app: Neo4jApp, documentId: str):
        query = """
        MATCH (d:Document {documentId: $documentId})
        RETURN d
        """
        parameters = {"documentId": documentId}
        result = app.run_query(query, parameters)
        if result:
            record = result[0]["d"]
            return cls(
                documentName=record["documentName"],
                author=record["author"],
                lastModifiedDate=date.fromisoformat(record["lastModifiedDate"]),
                version=record["version"],
                summary=record["summary"],
                createdDate=date.fromisoformat(record["createdDate"]),
                documentId=record["documentId"]
            )
        return None
        pass