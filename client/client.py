import websockets
import asyncio

async def live_analyze_client(code):
    uri = "ws://127.0.0.1:8000/ws/live-analyze"
    async with websockets.connect(uri) as websocket:
        print("Connected to the WebSocket server.")

        # Send the code to the WebSocket server
        await websocket.send(code)
        print("Sent code to the server.")

        # Continuously receive responses from the server
        while True:
            try:
                response = await websocket.recv()
                print(f"Server Response: {response}")
            except websockets.ConnectionClosedOK:
                print("Connection closed by the server.")
                break

# --- USED FOR TESTING BELOW
# if __name__ == "__main__":
#     # Test with sample Python code
#     sample_code = """
#     def add(a, b):
#         return a + b
#     print(add(2, 3))
#     """
    
#     # Run the WebSocket client
#     asyncio.run(live_analyze_client(sample_code))
