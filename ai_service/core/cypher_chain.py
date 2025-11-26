from langchain_neo4j import GraphCypherQAChain
from core.llm import model
from core.graph import graph
from dotenv import load_dotenv
load_dotenv()

cypher_qa = GraphCypherQAChain.from_llm(
    llm=model,
    graph=graph,
    allow_dangerous_requests=True,
    verbose=False,
    return_intermediate_steps=True,
)