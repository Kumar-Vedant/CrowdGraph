from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import asyncio

from graph_pipeline import app as graph_app

# initialize FastAPI
api = FastAPI()

# allow requests from Node.js backend
api.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@api.get("/")
async def root():
    return {"message": "Graph Query API is running!"}


@api.post("/query")
async def query_graph(request: Request):
    data = await request.json()
    question = data.get("question")

    if not question:
        return {"error": "Missing 'question' field in request body"}

    try:
        # LangGraph app is synchronous — run in executor if needed
        response = await asyncio.to_thread(graph_app.invoke, {"question": question})

        answer = response.get("answer", "No answer generated.")
        context = response.get("context", [])

        return {
            "question": question,
            "answer": answer,
            "context": context
        }

    except Exception as e:
        print(f"Error: {e}")
        return {"error": str(e)}


# run locally
if __name__ == "__main__":
    uvicorn.run("main:api", host="0.0.0.0", port=8000, reload=True)
