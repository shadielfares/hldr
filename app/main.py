# Packages
from fastapi import FastAPI, WebSocket
import asyncio
from utils.linting import lint_code
from utils.analysis import analyze_code

app = FastAPI()

clients = {}

# Websocket Endpoint
@app.websocket("/ws/live-analyze")
# Asynchronous call awaits only for changes, so it is non-polling and therefore non-blocking.
async def live_analyze(websocket: WebSocket):
    await websocket.accept()
    clients[websocket] = {"last_keystroke": asyncio.get_event_loop().time(), "code": ""}
    try:
        while True:
            # Waits for code, measures when the last keystroke was entered 
            code = await websocket.receive_text()
            clients[websocket]["last_keystroke"] = asyncio.get_event_loop().time()
            clients[websocket]["code"] = code
            #  
            while True:
                elapsed = asyncio.get_event_loop().time() - clients[websocket]["last_keystroke"]
                if elapsed >= 6:
                    # Checks return value from the lint_code Function
                    if lint_code(clients[websocket]["code"]):
                        await websocket.send_text("Linting errors found.")
                    else:
                        # This will return the CodeQL Suggestions
                        suggestions = analyze_code(clients[websocket]["code"])
                        await websocket.send_json({"status": "success", "suggestions": suggestions})
                    break
                await asyncio.sleep(1)
    except:
        # Will remove the clients dictonary if it exists, if it doesn't just returns None. Then closes the websocket
        clients.pop(websocket, None)
        await websocket.close()
