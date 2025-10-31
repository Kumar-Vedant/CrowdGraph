from typing_extensions import List, TypedDict
from langgraph.graph import START, StateGraph

from core.graph import graph_vector
from core.llm import model, prompt
from core.cypher_chain import cypher_qa

# LangGraph State definition
class State(TypedDict):
    question: str
    context: List[dict]
    answer: str

# retrieve context using vector similarity search + Cypher QA chain
def retrieve(state: State):
    question = state["question"]

    # vector similarity search to get top similar nodes
    similar_nodes = graph_vector.similarity_search(question, k=10)
    
    def format_doc(doc):
        meta = "; ".join(f"{key}: {value}" for key, value in doc.metadata.items())
        return f"Content: {doc.page_content}\nMetadata: {meta}"
    vector_context = "\n\n".join(format_doc(n) for n in similar_nodes)

    # use the vector context and the question to generate a cypher query
    cypher_prompt = f"""
    You are an expert Neo4j Cypher query generator and context retriever from a Neo4j Graph.

    Important:
    - Only generate read-only Cypher queries.  
    - You may use MATCH, OPTIONAL MATCH, WHERE, RETURN, ORDER BY, LIMIT, etc.
    - Focus on retrieving relevant data, not modifying the graph.

    The following information lists a knowledge graph's nodes and relationships that were found to be semantically similar to the user's question using a vector search.
    These may contain related words, synonyms, or alternate spellings of entities mentioned in the question.

    Use these as semantic clues treating them as possible matches for entities or relationships even if the words are not exact matches.

    Relevant Graph Context:
    {vector_context}

    Now, based on this context, generate the most relevant read-only Cypher query and run it to get all relevant nodes to answer the user's question.

    Be tolerant of small variations in spelling or phrasing.
    If an entity name in the question is semantically close to one in the context, assume they refer to the same node.

    Question: {question}
    """

    # Cypher-based retrieval
    cypher_response = cypher_qa.invoke({"query": cypher_prompt})
    cypher_context = cypher_response["result"]

    context = f"{vector_context}\n{cypher_context}"
    # print(context)

    return {"context": [context]}


# generate answer using LLM
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
workflow = StateGraph(State)
workflow.add_node("retrieve", retrieve)
workflow.add_node("generate", generate)

workflow.add_edge(START, "retrieve")
workflow.add_edge("retrieve", "generate")

app = workflow.compile()

# question = "Tell me all about different developers and the games they have developed ?"
# response = app.invoke({"question": question})
# print(response["answer"])