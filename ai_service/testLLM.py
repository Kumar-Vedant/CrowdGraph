import os
from dotenv import load_dotenv
load_dotenv()

from typing_extensions import List, TypedDict
from langchain_core.prompts import PromptTemplate
from langgraph.graph import START, StateGraph

from langchain_google_genai import ChatGoogleGenerativeAI

from langchain_neo4j import Neo4jGraph

# Create Neo4jGraph instance
graph = Neo4jGraph(
    url=os.getenv("NEO4J_URI"),
    username=os.getenv("NEO4J_USERNAME"), 
    password=os.getenv("NEO4J_PASSWORD"),
)

# result = graph.query("""
# MATCH (p:PLAYER)-[:PLAYS_FOR]->(t:TEAM)
# RETURN p.name AS player, t.name AS team
# """)

# print(result)


# initialize the model
model = ChatGoogleGenerativeAI(
    model="gemini-2.5-flash",
    temperature=0.2,
)

# define prompt structure
template = """Use the following pieces of context to answer the question at the end.
If you don't know the answer, just say that you don't know — don't try to make up an answer.

Context:
{context}

Question: {question}

Answer:"""

prompt = PromptTemplate.from_template(template)

# LangGraph State definition
class State(TypedDict):
    question: str
    context: List[dict]
    answer: str

# retrieve state from DB and pass it as context
def retrieve(state: State):
    # context = [
    #     {"location": "London", "weather": "Cloudy, sunny skies later"},
    #     {"location": "San Francisco", "weather": "Sunny skies, raining overnight."},
    # ]
    context = graph.query("CALL db.schema.visualization()")

    return {"context": context}

# generate answer using query and context
def generate(state: State):
    # prepare prompt input
    messages = prompt.invoke({
        "question": state["question"],
        "context": state["context"]
    })
    
    # invoke model to generate answer
    response = model.invoke(messages)
    
    return {"answer": response.content}

# LangGraph workflow (START -> retrieve context -> generate answer)
workflow = StateGraph(State).add_sequence([retrieve, generate])
workflow.add_edge(START, "retrieve")
app = workflow.compile()


question = "Comment on the graph's structure?"
response = app.invoke({"question": question})

print("Answer:", response["answer"])