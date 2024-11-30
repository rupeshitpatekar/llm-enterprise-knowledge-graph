from backend.agentic_rag_service.src.Neo4jApp import app

query = """
MATCH (p:Person)-[:KNOWS]->(friend)
WHERE p.name = $name
RETURN friend.name AS friend_name
"""
parameters = {"name": "Alice"}
result = app.run_query(query, parameters)
for record in result:
    print(record["friend_name"])
