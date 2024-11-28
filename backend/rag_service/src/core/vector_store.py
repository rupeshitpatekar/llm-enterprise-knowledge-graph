from nameko.rpc import rpc
import chromadb
from chromadb.config import Settings
from typing import List, Dict, Optional
from prometheus_client import Counter, Histogram
import time
from config.settings import settings


class VectorStoreService:
    name = "vector_store"

    # Metrics
    query_counter = Counter('vector_store_queries_total', 'Total number of vector store queries')
    query_latency = Histogram('vector_store_query_duration_seconds', 'Vector store query duration')
    add_doc_counter = Counter('vector_store_documents_added_total', 'Total number of documents added')

    def __init__(self):
        self.client = chromadb.Client(Settings(
            chroma_db_impl="duckdb+parquet",
            persist_directory=settings.CHROMA_PERSIST_DIR
        ))
        self.collection = self.client.create_collection("documents")

    @rpc
    def add_documents(self, documents: List[str], metadata_list: Optional[List[Dict]] = None) -> Dict:
        try:
            start_time = time.time()

            if metadata_list is None:
                metadata_list = [{} for _ in documents]

            self.collection.add(
                documents=documents,
                metadata=metadata_list,
                ids=[f"doc_{int(time.time())}_{i}" for i in range(len(documents))]
            )

            self.add_doc_counter.inc(len(documents))

            return {
                "success": True,
                "count": len(documents),
                "duration": time.time() - start_time
            }
        except Exception as e:
            return {
                "success": False,
                "error": str(e)
            }

    @rpc
    def query(self, query_text: str, n_results: int = 3) -> Dict:
        try:
            with self.query_latency.time():
                results = self.collection.query(
                    query_texts=[query_text],
                    n_results=n_results
                )

            self.query_counter.inc()

            return {
                "success": True,
                "results": results
            }
        except Exception as e:
            return {
                "success": False,
                "error": str(e)
            }