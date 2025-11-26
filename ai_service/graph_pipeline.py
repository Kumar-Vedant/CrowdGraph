from typing_extensions import List, TypedDict
from langgraph.graph import START, StateGraph

from core.graph import graph_vector
from core.llm import model, prompt
from core.cypher_chain import cypher_qa

# LangGraph State definition
class State(TypedDict):
    question: str
    community_id: str
    context: List[dict]
    node_ids: List[str]
    edge_ids: List[str]
    answer: str

# retrieve context using vector similarity search + Cypher QA chain
def retrieve(state: State):
    question = state["question"]
    community_id = state["community_id"]

    # vector similarity search to get top similar nodes
    similar_nodes = graph_vector.similarity_search(question, k=5, params={"communityId": community_id})
    
    def format_doc(doc):
        meta = "; ".join(f"{key}: {value}" for key, value in doc.metadata.items())
        return f"Content: {doc.page_content}\nMetadata: {meta}"
    vector_context = "\n\n".join(format_doc(n) for n in similar_nodes)
    node_ids = [node.metadata.get("id") for node in similar_nodes]

    # use the vector context and the question to generate a cypher query
    cypher_prompt = f"""
    You are an expert Neo4j Cypher query generator and context retriever from a Neo4j Graph.

    Important:
    - Only generate read-only Cypher queries.  
    - You may use MATCH, OPTIONAL MATCH, WHERE, RETURN, ORDER BY, LIMIT, etc.
    - Focus on retrieving relevant data, not modifying the graph.
    - Never extract the 'embedding' property of any node.
    - **Crucial:** For every node and relationship matched in your query (e.g., n, m, r), you MUST return its element ID using the function elementId(). Alias the node IDs as 'id_[variable]' and relationship IDs as 'id_rel_[variable]'.
    - Only query **nodes and relationships that have a property communityId = '{community_id}'** by adding a WHERE clause to filter for communityId.
    
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

    # extract the node and edge ids used in answer generation
    element_ids = extract_ids_from_cypher_context(cypher_response["intermediate_steps"][1]["context"])
    node_ids += element_ids["node_ids"]
    node_ids = list(set(node_ids))
    edge_ids = element_ids["edge_ids"]
    
    cypher_context = cypher_response["result"]
    context = f"{vector_context}\n{cypher_context}"

    return {"context": [context], "node_ids": node_ids, "edge_ids": edge_ids}


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

def extract_ids_from_cypher_context(raw_cypher_result):
    unique_node_ids = set()
    unique_edge_ids = set()

    # prefixes set in the prompt
    node_prefix = 'id_'
    edge_prefix = 'id_rel_'

    # iterate through all key-value pairs in each row
    for row in raw_cypher_result:
        for key, value in row.items():
            if value is None:
                continue

            # check for edge ids first, as their prefix is longer
            if key.startswith(edge_prefix):
                if isinstance(value, str):
                    unique_edge_ids.add(value)
            
            # check for node ids
            elif key.startswith(node_prefix):
                if isinstance(value, str):
                    unique_node_ids.add(value)

    return {
        "node_ids": list(unique_node_ids),
        "edge_ids": list(unique_edge_ids)
    }

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