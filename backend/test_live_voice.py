import asyncio
import os

from dotenv import load_dotenv
from google import genai


load_dotenv()

api_key = os.getenv("GOOGLE_API_KEY")

if not api_key:
    raise ValueError("GOOGLE_API_KEY not found.")


client = genai.Client(
    api_key=api_key
)


async def test_gemini_live():

    print("Connecting to Gemini Live...")

    async with client.aio.live.connect(
        model="gemini-3.8-live",
        config={
            "response_modalities": ["AUDIO"],
        },
    ) as session:

        print("GEMINI LIVE CONNECTED")

        await session.send_client_content(
            turns={
                "role": "user",
                "parts": [
                    {
                        "text": "Hello"
                    }
                ],
            },
            turn_complete=True,
        )

        async for response in session.receive():

            if response.server_content:
                if response.server_content.output_transcription:
                    print(
                        "Gemini:",
                        response.server_content.output_transcription.text
                    )

                if response.server_content.model_turn:
                    print("AUDIO RESPONSE RECEIVED")

            break


if __name__ == "__main__":
    asyncio.run(test_gemini_live())

