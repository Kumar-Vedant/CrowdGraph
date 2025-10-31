import os
from dotenv import load_dotenv
load_dotenv()

from huggingface_hub import InferenceClient
from langchain_neo4j import Neo4jVector, Neo4jGraph

graph = Neo4jGraph(
    url=os.getenv("NEO4J_URI").replace("neo4j+s://", "bolt+s://"),
    username=os.getenv("NEO4J_USERNAME"), 
    password=os.getenv("NEO4J_PASSWORD"),
)

# HF inference client for embeddings
hf_client = InferenceClient(api_key=os.environ["HF_TOKEN"])

class HFEmbeddingModel:
    def __init__(self, model_name="google/embeddinggemma-300m"):
        self.model_name = model_name

    def _get_embedding(self, text: str):
        result = hf_client.feature_extraction(
            text,
            model=self.model_name,
        )
        # flatten result if nested
        if isinstance(result[0], list):
            return result[0]
        return result

    def embed_documents(self, texts):
        """Used when embedding multiple documents"""
        return [self._get_embedding(text) for text in texts]

    def embed_query(self, text):
        """Used when embedding a single query string"""
        return self._get_embedding(text)



embedding_model = HFEmbeddingModel()

graph_vector = Neo4jVector.from_existing_index(
    embedding=embedding_model,
    graph=graph,
    index_name="nodeIndex",
    embedding_node_property="embedding",
    text_node_property="name",
)

query_text = "How many games are in the first-person Shooter genre ?"
top_k = 5

similar_nodes = graph_vector.similarity_search(query_text, k=top_k)

print("Top similar nodes:")
for node in similar_nodes:
    print(node)
