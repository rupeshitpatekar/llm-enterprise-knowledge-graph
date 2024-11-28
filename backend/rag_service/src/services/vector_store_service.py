# vector_store_service.py

from nameko.rpc import rpc
from typing import List, Dict
import numpy as np

class VectorStoreService:
    name = "vector_store"

    def __init__(self):
        self.vectors = {}  # In-memory store for vectors, replace with actual vector store in production

    @rpc
    def add_vector(self, vector_id: str, vector: List[float]):
        """Add a vector to the store."""
        self.vectors[vector_id] = np.array(vector)
        return {"status": "success", "message": f"Vector {vector_id} added."}

    @rpc
    def get_vector(self, vector_id: str) -> Dict:
        """Retrieve a vector from the store."""
        vector = self.vectors.get(vector_id)
        if vector is None:
            return {"status": "error", "message": f"Vector {vector_id} not found."}
        return {"status": "success", "vector": vector.tolist()}

    @rpc
    def delete_vector(self, vector_id: str):
        """Delete a vector from the store."""
        if vector_id in self.vectors:
            del self.vectors[vector_id]
            return {"status": "success", "message": f"Vector {vector_id} deleted."}
        return {"status": "error", "message": f"Vector {vector_id} not found."}

    @rpc
    def search_vectors(self, query_vector: List[float], top_k: int = 5) -> List[Dict]:
        """Search for the top_k most similar vectors."""
        query_vector = np.array(query_vector)
        similarities = {
            vector_id: np.dot(query_vector, vector) / (np.linalg.norm(query_vector) * np.linalg.norm(vector))
            for vector_id, vector in self.vectors.items()
        }
        sorted_vectors = sorted(similarities.items(), key=lambda item: item[1], reverse=True)[:top_k]
        return [{"vector_id": vector_id, "similarity": similarity} for vector_id, similarity in sorted_vectors]