#AI Packages
from openai import OpenAI
#API Packages
from fastapi import FastAPI
from pydantic import BaseModel
#ENV Packages
import os
from dotenv import load_dotenv

load_dotenv()
openai_api_key = os.getenv("OPENAI_API_KEY")
#Creating Instances
app = FastAPI()
client = OpenAI()

class CodeSnippet(BaseModel):
    snippet: str
#POST END-Point
@app.post("/analyze")
async def analyze_code(snippet: CodeSnippet):
    #Using OpenAI API for analysis
    try:
        # Pick one of the Azure OpenAI models from the GitHub Models service
        model_name = "gpt-4o-mini"

        response = client.chat.completions.create(
            messages=[
                {
                    "role": "system",
                    "content": "You are the best code analyzer. You will analyze code given to you, and suggest more optimized solutions. If you feel you are analyizing a Data Structures & Algorithms related question, you will suggest a more optimized solution without giving all the details. If you find a syntax error, you will simply mention it but not point out where you found it. Generically, you will help without spoon-feeding the answers.",
                },
                {
                    "role": "user",
                    "content": f"Here is the code: {snippet.snippet}",
                },
            ],
            model=model_name,
            # Optional parameters
            temperature=1.,
            max_tokens=1000,
            top_p=1   
        )
        return response.choices[0].message.content

    except SyntaxError as e:
        return [f"Syntax Error: {e}"]
    
@app.get('/')
def entry():
    return "Welcome"