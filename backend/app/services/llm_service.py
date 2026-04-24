from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser
from langchain_openai import ChatOpenAI

from app.core.config import GROQ_API_KEY

MODEL = "llama-3.1-8b-instant"


def call_groq_llm(context: str, query: str):
    if not GROQ_API_KEY:
        raise ValueError("GROQ_API_KEY not set")

    context = context.strip()
    query = query.strip()

    if not context or not query:
        raise ValueError("Context and query cannot be empty")

    prompt = ChatPromptTemplate.from_template(
        """
You are an AI assistant.

Answer the question based ONLY on the context below.

Context:
{context}

Question:
{query}
"""
    )

    llm = ChatOpenAI(
        api_key=GROQ_API_KEY,
        base_url="https://api.groq.com/openai/v1",
        model=MODEL,
    )

    chain = prompt | llm | StrOutputParser()

    try:
        return chain.invoke({"context": context, "query": query})
    except Exception as e:
        raise Exception(f"Groq LLM call failed: {str(e)}")
