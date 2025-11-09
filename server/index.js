import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json({ limit: '50mb' }));

// Initialize Gemini AI
const API_KEY = process.env.GEMINI_API_KEY;
if (!API_KEY) {
  throw new Error("GEMINI_API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

// Response schema for Gemini
const responseSchema = {
  type: Type.OBJECT,
  properties: {
    chatResponse: {
      type: Type.STRING,
      description: "A conversational, informative, and helpful response to the user's query, acting as Lexora, a U.S. Civil Law AI Assistant.",
    },
    summary: {
      type: Type.STRING,
      description: "A comprehensive, updated bullet-point summary of the entire case based on the full conversation history. Include sections for Case Overview, Recognized Facts, Legal Issues, and Key Evidence.",
    },
    mindMap: {
      type: Type.OBJECT,
      description: "A JSON graph object representing the relationships between entities in the case. Ensure node IDs are consistent.",
      properties: {
        nodes: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING, description: "Unique identifier for the node." },
              label: { type: Type.STRING, description: "Display label for the node." },
            },
            required: ["id", "label"],
          },
        },
        edges: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              source: { type: Type.STRING, description: "ID of the source node." },
              target: { type: Type.STRING, description: "ID of the target node." },
              label: { type: Type.STRING, description: "Label describing the relationship." },
            },
            required: ["source", "target", "label"],
          },
        },
      },
      required: ["nodes", "edges"],
    },
  },
  required: ["chatResponse", "summary", "mindMap"],
};

// Helper function to generate system instruction
const getSystemInstruction = (history) => {
  const historyText = history.map(msg => `${msg.role}: ${msg.content}`).join('\n');
  
  return `You are a U.S. Civil Law AI Assistant named Lexora. You help users analyze, summarize, and understand civil legal issues. You are not a lawyer, but provide educational and informational insights. You can read uploaded documents, identify clauses, detect loopholes, and create summaries or visual structures of the case.

Based on the entire conversation history provided below, generate a comprehensive response.

Conversation History:
${historyText}

Your task is to respond to the user's latest query while also updating the case summary and mind map based on all available information. Provide your output as a single, valid JSON object matching the prescribed schema. Do not include any markdown formatting like \`\`\`json in your response.`;
};

// API Routes

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

// Process user message with Gemini
app.post('/api/process-message', async (req, res) => {
  try {
    const { history, userInput, imageBase64, isThinkingMode } = req.body;

    if (!history || !userInput) {
      return res.status(400).json({ error: 'Missing required fields: history and userInput' });
    }

    const modelName = isThinkingMode ? 'gemini-2.5-pro' : 'gemini-2.5-flash';
    const thinkingConfig = isThinkingMode ? { thinkingConfig: { thinkingBudget: 32768 } } : {};

    const userParts = [{ text: `User's latest message: ${userInput}` }];

    if (imageBase64) {
      userParts.unshift({
        inlineData: {
          mimeType: 'image/jpeg',
          data: imageBase64,
        },
      });
    }

    const response = await ai.models.generateContent({
      model: modelName,
      contents: { parts: userParts },
      config: {
        systemInstruction: getSystemInstruction(history),
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        ...thinkingConfig,
      },
    });

    const jsonText = response.text.trim();
    const parsedResponse = JSON.parse(jsonText);

    // Validate mind map structure
    if (!parsedResponse.mindMap || !Array.isArray(parsedResponse.mindMap.nodes) || !Array.isArray(parsedResponse.mindMap.edges)) {
      console.warn("Received invalid mind map structure, returning empty mind map.");
      parsedResponse.mindMap = { nodes: [], edges: [] };
    }

    res.json(parsedResponse);

  } catch (error) {
    console.error("Error processing message:", error);
    res.status(500).json({
      error: 'Failed to process message',
      chatResponse: "I'm sorry, but I encountered an error trying to process your request. Please try again later.",
      summary: "Error: Could not generate summary.",
      mindMap: { nodes: [], edges: [] },
    });
  }
});

// Mock OAuth endpoints (replace with real OAuth implementation)
app.post('/api/auth/google', async (req, res) => {
  try {
    const { token } = req.body;
    
    // In production, verify the token with Google
    // For now, return mock user data
    const mockUser = {
      googleId: `google-${Date.now()}`,
      name: 'Demo User',
      email: 'demo.user@example.com',
      picture: `https://i.pravatar.cc/150?u=${Date.now()}`,
    };
    
    res.json({ user: mockUser });
  } catch (error) {
    console.error("Auth error:", error);
    res.status(401).json({ error: 'Authentication failed' });
  }
});

// Database operations (using in-memory store for demo)
let database = {
  users: [],
  threads: []
};

// UUID generator
const uuid = () => 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
  const r = Math.random() * 16 | 0;
  const v = c === 'x' ? r : (r & 0x3 | 0x8);
  return v.toString(16);
});

// Get or create user
app.post('/api/users/find-or-create', async (req, res) => {
  try {
    const { googleId, name, email, picture } = req.body;
    
    let user = database.users.find(u => u.googleId === googleId);
    
    if (!user) {
      user = { id: googleId, googleId, name, email, picture };
      database.users.push(user);
      
      // Create first thread for new user
      const firstThread = {
        id: uuid(),
        userId: user.id,
        title: 'My First Case',
        messages: [{
          role: 'assistant',
          content: 'Welcome to Lexora! How can I assist you with your case today? You can start by describing the situation or uploading a relevant document.',
          timestamp: new Date().toISOString(),
        }],
        summary: 'No summary has been generated yet.',
        mindMap: { nodes: [], edges: [] },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      database.threads.push(firstThread);
    }
    
    const userThreads = database.threads
      .filter(t => t.userId === user.id)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    
    res.json({ user, threads: userThreads });
  } catch (error) {
    console.error("Error finding/creating user:", error);
    res.status(500).json({ error: 'Failed to process user' });
  }
});

// Create new thread
app.post('/api/threads', async (req, res) => {
  try {
    const { userId } = req.body;
    
    if (!userId) {
      return res.status(400).json({ error: 'userId is required' });
    }
    
    const userThreadCount = database.threads.filter(t => t.userId === userId).length;
    
    const newThread = {
      id: uuid(),
      userId,
      title: `Case #${userThreadCount + 1}`,
      messages: [{
        role: 'assistant',
        content: 'This is a new case thread. What information can you provide to get started?',
        timestamp: new Date().toISOString(),
      }],
      summary: 'No summary has been generated yet.',
      mindMap: { nodes: [], edges: [] },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    database.threads.push(newThread);
    res.json(newThread);
  } catch (error) {
    console.error("Error creating thread:", error);
    res.status(500).json({ error: 'Failed to create thread' });
  }
});

// Update thread
app.patch('/api/threads/:threadId', async (req, res) => {
  try {
    const { threadId } = req.params;
    const updatedData = req.body;
    
    const threadIndex = database.threads.findIndex(t => t.id === threadId);
    
    if (threadIndex === -1) {
      return res.status(404).json({ error: 'Thread not found' });
    }
    
    database.threads[threadIndex] = {
      ...database.threads[threadIndex],
      ...updatedData,
      updatedAt: new Date().toISOString()
    };
    
    res.json(database.threads[threadIndex]);
  } catch (error) {
    console.error("Error updating thread:", error);
    res.status(500).json({ error: 'Failed to update thread' });
  }
});

// Get user threads
app.get('/api/users/:userId/threads', async (req, res) => {
  try {
    const { userId } = req.params;
    
    const userThreads = database.threads
      .filter(t => t.userId === userId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    
    res.json(userThreads);
  } catch (error) {
    console.error("Error fetching threads:", error);
    res.status(500).json({ error: 'Failed to fetch threads' });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`API available at http://localhost:${PORT}/api`);
});