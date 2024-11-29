import logging
from neo4j import GraphDatabase, basic_auth

# Initialize the connection
class Neo4jApp:
    def __init__(self, uri, user, password):
        self.driver = GraphDatabase.driver(uri, auth=basic_auth(user, password))

    def close(self):
        if self.driver:
            self.driver.close()

    def run_query(self, query, parameters=None):
        if parameters is None:
            parameters = {}
        try:
            with self.driver.session() as session:
                result = session.run(query, parameters)
                return [record for record in result]
        except Exception as e:
            logging.error(f"An error occurred: {e}")
            return None

# Connect to the database
app = Neo4jApp("bolt://localhost:7687", "neo4j", "backend_dev")

# Example query to create a node
query = "CREATE (n:Person {name: $name}) RETURN n"
parameters = {"name": "Alice"}
result = app.run_query(query, parameters)
if result:
    print([record["n"] for record in result])
else:
    print("Query failed")

app.close()