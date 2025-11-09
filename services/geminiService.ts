
// import { GoogleGenAI, Type, GenerateContentResponse } from "@google/genai";
// import { Message, GeminiResponse, MindMap } from '../types';

// const API_KEY = process.env.API_KEY;

// if (!API_KEY) {
//   throw new Error("API_KEY environment variable not set");
// }

// const ai = new GoogleGenAI({ apiKey: API_KEY });

// const responseSchema = {
//     type: Type.OBJECT,
//     properties: {
//         chatResponse: {
//             type: Type.STRING,
//             description: "A conversational, informative, and helpful response to the user's query, acting as Lexora, a U.S. Civil Law AI Assistant.",
//         },
//         summary: {
//             type: Type.STRING,
//             description: "A comprehensive, updated bullet-point summary of the entire case based on the full conversation history. Include sections for Case Overview, Recognized Facts, Legal Issues, and Key Evidence.",
//         },
//         mindMap: {
//             type: Type.OBJECT,
//             description: "A JSON graph object representing the relationships between entities in the case. Ensure node IDs are consistent.",
//             properties: {
//                 nodes: {
//                     type: Type.ARRAY,
//                     items: {
//                         type: Type.OBJECT,
//                         properties: {
//                             id: { type: Type.STRING, description: "Unique identifier for the node (e.g., person's name, company name)." },
//                             label: { type: Type.STRING, description: "Display label for the node." },
//                         },
//                         required: ["id", "label"],
//                     },
//                 },
//                 edges: {
//                     type: Type.ARRAY,
//                     items: {
//                         type: Type.OBJECT,
//                         properties: {
//                             source: { type: Type.STRING, description: "ID of the source node." },
//                             target: { type: Type.STRING, description: "ID of the target node." },
//                             label: { type: Type.STRING, description: "Label describing the relationship." },
//                         },
//                         required: ["source", "target", "label"],
//                     },
//                 },
//             },
//             required: ["nodes", "edges"],
//         },
//     },
//     required: ["chatResponse", "summary", "mindMap"],
// };

// const getSystemInstruction = (history: Message[]): string => {
//   const historyText = history.map(msg => `${msg.role}: ${msg.content}`).join('\n');

//   return `You are a U.S. Civil Law AI Assistant named Lexora. You help users analyze, summarize, and understand civil legal issues. You are not a lawyer, but provide educational and informational insights. You can read uploaded documents, identify clauses, detect loopholes, and create summaries or visual structures of the case.

// Based on the entire conversation history provided below, generate a comprehensive response.

// Conversation History:
// ${historyText}

// Your task is to respond to the user's latest query while also updating the case summary and mind map based on all available information. Provide your output as a single, valid JSON object matching the prescribed schema. Do not include any markdown formatting like \`\`\`json in your response.`;
// };


// export const processUserTurn = async (
//   history: Message[],
//   userInput: string,
//   imageBase64: string | null,
//   isThinkingMode: boolean
// ): Promise<GeminiResponse> => {
//   const modelName = isThinkingMode ? 'gemini-2.5-pro' : 'gemini-2.5-flash';
//   // FIX: Wrapped thinkingBudget in a thinkingConfig object to match the API specification.
//   const thinkingConfig = isThinkingMode ? { thinkingConfig: { thinkingBudget: 32768 } } : {};

//   const userParts: any[] = [{ text: `User's latest message: ${userInput}` }];

//   if (imageBase64) {
//     userParts.unshift({
//       inlineData: {
//         mimeType: 'image/jpeg', // Assuming jpeg, could be dynamic
//         data: imageBase64,
//       },
//     });
//   }
  
//   try {
//     const response: GenerateContentResponse = await ai.models.generateContent({
//       model: modelName,
//       contents: { parts: userParts },
//       config: {
//         systemInstruction: getSystemInstruction(history),
//         responseMimeType: "application/json",
//         responseSchema: responseSchema,
//         ...thinkingConfig,
//       },
//     });
    
//     const jsonText = response.text.trim();
//     const parsedResponse = JSON.parse(jsonText);

//     // Basic validation to ensure the mind map is usable
//     if (!parsedResponse.mindMap || !Array.isArray(parsedResponse.mindMap.nodes) || !Array.isArray(parsedResponse.mindMap.edges)) {
//         console.warn("Received invalid mind map structure, returning empty mind map.");
//         parsedResponse.mindMap = { nodes: [], edges: [] };
//     }

//     return parsedResponse;

//   } catch (error) {
//     console.error("Error processing user turn with Gemini:", error);
//     // Return a structured error response
//     return {
//       chatResponse: "I'm sorry, but I encountered an error trying to process your request. The issue might be with the API or the provided data. Please try again later.",
//       summary: "Error: Could not generate summary.",
//       mindMap: { nodes: [], edges: [] },
//     };
//   }
// };
