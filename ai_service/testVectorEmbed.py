import os
from huggingface_hub import InferenceClient
from dotenv import load_dotenv
load_dotenv()

client = InferenceClient(
    api_key=os.environ["HF_TOKEN"],
    provider="hf-inference"
)

embedding = client.feature_extraction(
    "I am Optimus Prime",
    model="google/embeddinggemma-300m"
)

print(embedding)