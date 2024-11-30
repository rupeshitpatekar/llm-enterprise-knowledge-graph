# backend/agentic_rag_service/src/Neo4jRepository.py

from backend.agentic_rag_service.src import Neo4jApp
from backend.agentic_rag_service.src.entity.DocumentEntity import DocumentEntity
from backend.agentic_rag_service.src.entity.MemberEntity import MemberEntity

class Neo4jRepository:
    def __init__(self, app: Neo4jApp):
        self.app = app

    def save_document(self, document: DocumentEntity):
        return document.save(self.app)

    def find_document_by_name(self, documentName: str):
        return DocumentEntity.find_by_name(self.app, documentName)

    def find_document_by_id(self, documentId: str):
        return DocumentEntity.find_by_id(self.app, documentId)

    def save_member(self, member: MemberEntity):
        return member.save(self.app)

    def find_member_by_id(self, memberId: str):
        return MemberEntity.find_by_id(self.app, memberId)