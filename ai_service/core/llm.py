from langchain_core.prompts import PromptTemplate
from langchain_google_genai import ChatGoogleGenerativeAI
from dotenv import load_dotenv
load_dotenv()

# initialize the model
model = ChatGoogleGenerativeAI(
    model="gemini-2.5-flash",
    temperature=0.1,
)

# define prompt structure
template = """
You are an expert knowledge assistant specializing in analyzing and reasoning over a Neo4j knowledge graph.

You will be given structured information about graph nodes, relationships, and properties as Context, followed by a Question.

Your task:
- Use only the provided context to answer the question comprehensively and in depth.
- The provided context will contain relevant nodes with their labels, properties, and their relationships to others.
- Use all available details to generate a long, descriptive, and well-reasoned answer.
- Analyze how the nodes and relationships connect to form a complete picture of the topic.
- Explain important terms, entities, and relationships in context.
- Expand on connections between entities, their properties, and relationships to make the answer insightful and complete.
- Never invent or assume facts not present in the context.
- Never mention the source, just answer the question assuming the source knowledge is your knowledge
- If the question cannot be answered from the given data, just say that you don't know — don't try to make up an answer.

Formatting:
- Write the answer as a well-structured explanation or analysis.
- Use bullet points, lists, or short paragraphs if it improves clarity.
- When referring to entities, use their names or labels as shown in the context.
- Never refer to the internal id of any entity in the answer

Context:
{context}

Question:
{question}"""

prompt = PromptTemplate.from_template(template)