import os
from openai import OpenAI
def analyze_code(code):
    try:
        token = os.environ["GITHUB_TOKEN"]
        endpoint = "https://models.inference.ai.azure.com"

        # Pick one of the Azure OpenAI models from the GitHub Models service
        model_name = "gpt-4o-mini"

        client = OpenAI(
            base_url=endpoint,
            api_key=token,
        )

        response = client.chat.completions.create(
            messages=[
                {
                    "role": "system",
                    "content": "You are the best code analyzer. You will analyze code given to you, and suggest more optimized solutions. If feel you are analyizing a Data Structures & Algorithms related question, you will suggest a more optimized solution without giving all the details. If you find a syntax error, you will simply mention it but not point out where you found it. Generically, you will help without spoon-feeding the answers.",
                },
                {
                    "role": "user",
                    "content": f"Here is the code: {code}",
                },
            ],
            model=model_name,
            # Optional parameters
            temperature=1.,
            max_tokens=1000,
            top_p=1.    
        )
        return response.choices[0].message.content

    except SyntaxError as e:
        return [f"Syntax Error: {e}"]
