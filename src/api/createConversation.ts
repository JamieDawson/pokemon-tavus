import { IConversation } from "@/types";

export const createConversation = async (
  token: string,
): Promise<IConversation> => {
  console.log("token is, ", token);
  const response = await fetch("https://tavusapi.com/v2/conversations", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": token,
    },
    body: JSON.stringify({
      // Pokemon Expert Persona
      replica_id: "r9fa0878977a",
      persona_id: "pf1dcc780bb3",
    }),
  });

  if (!response?.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();
  return data;
};
