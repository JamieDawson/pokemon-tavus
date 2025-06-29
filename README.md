# 🎮 Tavus + PokéAPI Tool Call Demo

This project demonstrates how to integrate a `tool_call` in a Tavus-powered video chat application using the [Daily.co](https://www.daily.co/) SDK and a third-party API (PokéAPI) to fetch dynamic Pokémon data in real time.

---

Start by forking the ready-to-use **Pokemon Demo** and explore Tavus CVI's real-time video interactions. Whether you need the classic Persona or a customized version, the demo provides all the building blocks to get started.  

## 🍴 **Forking & Running the Demo**  

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the development server:**
   ```bash
   npm run dev
   ```

---

## 🔍 What It Does

When a user asks a question like:

> “Tell me something about Charmander!”

The app triggers a `tool_call` event via the Tavus LLM pipeline. That event is handled in real time by the app using the Daily API. Based on the tool name (`get_pokemon_fact`) and arguments (e.g., `"pokemon_name": "charmander"`), the app makes a request to the [PokéAPI](https://pokeapi.co) to fetch:

- The Pokémon's **types**
- Their **abilities**
- Their **height and weight** (converted into feet/inches and pounds)

A random fact is selected and then echoed back to the user through the `conversation.echo` event — displayed inside the video chat session, as if it were a natural response.

---

## How It Works

1. **User Prompt → Tool Call**
   - The user says something that triggers a tool call: `conversation.tool_call`.
   - Tavus sends an `app-message` to the app with the tool name and arguments.

2. **Handle Tool Call**
   - The app listens for `app-message` events.
   - If the tool call is `get_pokemon_fact`, it extracts the `pokemon_name`, calls the PokéAPI, and randomly selects a fact.

3. **Send Back Response**
   - The selected fact is sent back using `conversation.echo`.

---

##  Example Tool Call

```json
{
  "message_type": "conversation",
  "event_type": "conversation.tool_call",
  "properties": {
    "name": "get_pokemon_fact",
    "arguments": "{\"pokemon_name\":\"eevee\"}"
  }
}
```

## Example Response

```
{
  "message_type": "conversation",
  "event_type": "conversation.echo",
  "properties": {
    "modality": "text",
    "text": "This Pokémon has the following abilities: run-away, adaptability, anticipation"
  }
}
```

## Steps needed to apply a the get_pokemon_fact `tool_call` to your Persona.

1. Create a `PATCH` request in Postman
2. In the `PATCH` URL, use  `https://tavusapi.com/v2/personas/PERSONA_ID_HERE`
3. In the Headers tab, use:
- x-api-key: YOUR_TAVUS_API_KEY
- Content-Type: application/json
4. In the Raw -> Body tab, paste this:

```
[
  {
    "op": "replace",
    "path": "/layers/llm/tools",
    "value": [
      {
        "type": "function",
        "function": {
          "name": "get_pokemon_fact",
          "description": "Get abilities of a given Pokémon",
          "parameters": {
            "type": "object",
            "properties": {
              "pokemon_name": {
                "type": "string",
                "description": "Name of the Pokémon, e.g., Pikachu"
              }
            },
            "required": ["pokemon_name"]
          }
        }
      }
    ]
  }
]
```
5. Click the `SEND` to send the request.

You can confirm in Postman if your Persona is updated by making a `GET` request to `https://tavusapi.com/v2/personas/PERSONA_ID_HERE` and checking the body.

## 📚 **Learn More About Tavus**  

- [Developer Documentation](https://docs.tavus.io/)  
- [API Reference](https://docs.tavus.io/api-reference/)
- [Tavus Platform](https://platform.tavus.io/)  
- [Creating a Persona](https://docs.tavus.io/sections/conversational-video-interface/creating-a-persona)
- [Daily React Reference](https://docs.daily.co/reference/daily-react)