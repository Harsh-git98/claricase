import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';
import { MongoClient } from 'mongodb';

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


// MongoDB setup
const MONGODB_URI = process.env.MONGODB_URI || process.env.MONGO_URI;
if (!MONGODB_URI) {
  console.warn('MONGODB_URI not set - falling back to in-memory DB. Set MONGODB_URI to enable persistence.');
}

let db = null;
let usersCol = null;
let threadsCol = null;

const connectMongo = async () => {
  if (!MONGODB_URI) return null;
  const client = new MongoClient(MONGODB_URI);
  await client.connect();
  db = client.db(process.env.MONGODB_DBNAME || 'lexora');
  usersCol = db.collection('users');
  threadsCol = db.collection('threads');
  // Ensure indexes
  await usersCol.createIndex({ email: 1 }, { unique: true });
  await threadsCol.createIndex({ userId: 1 });
  console.log('Connected to MongoDB');
};

connectMongo().catch(err => {
  console.error('MongoDB connection error:', err);
});

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

// --- Simple Affine Cipher (not secure, demo only) ---
const AFFINE_A = 5; // must be coprime with MOD
const AFFINE_B = 8;
const MOD = 65536; // operate on 16-bit code units

const egcd = (a, b) => {
  if (b === 0) return { g: a, x: 1, y: 0 };
  const res = egcd(b, a % b);
  return { g: res.g, x: res.y, y: res.x - Math.floor(a / b) * res.y };
};

const modInverse = (a, m) => {
  const res = egcd(a, m);
  if (res.g !== 1) throw new Error('No modular inverse');
  return ((res.x % m) + m) % m;
};

const AFFINE_A_INV = (() => {
  try { return modInverse(AFFINE_A, MOD); } catch (e) { return 1; }
})();

const affineEncrypt = (text) => {
  if (text == null) return text;
  let out = '';
  for (let i = 0; i < text.length; i++) {
    const code = text.charCodeAt(i);
    const enc = (AFFINE_A * code + AFFINE_B) % MOD;
    out += String.fromCharCode(enc);
  }
  return out;
};

const affineDecrypt = (text) => {
  if (text == null) return text;
  let out = '';
  for (let i = 0; i < text.length; i++) {
    const code = text.charCodeAt(i);
    const dec = (AFFINE_A_INV * ((code - AFFINE_B + MOD) % MOD)) % MOD;
    out += String.fromCharCode(dec);
  }
  return out;
};

const encryptThreadForSave = (thread) => {
  const t = JSON.parse(JSON.stringify(thread));
  if (Array.isArray(t.messages)) {
    t.messages = t.messages.map(m => ({ ...m, content: typeof m.content === 'string' ? affineEncrypt(m.content) : m.content }));
  }
  if (typeof t.summary === 'string') t.summary = affineEncrypt(t.summary);
  if (t.mindMap && Array.isArray(t.mindMap.nodes)) {
    t.mindMap.nodes = t.mindMap.nodes.map(n => ({ ...n, label: typeof n.label === 'string' ? affineEncrypt(n.label) : n.label }));
  }
  if (t.mindMap && Array.isArray(t.mindMap.edges)) {
    t.mindMap.edges = t.mindMap.edges.map(e => ({ ...e, label: typeof e.label === 'string' ? affineEncrypt(e.label) : e.label }));
  }
  return t;
};

const decryptThreadFromDb = (thread) => {
  if (!thread) return thread;
  const t = JSON.parse(JSON.stringify(thread));
  if (Array.isArray(t.messages)) {
    t.messages = t.messages.map(m => ({ ...m, content: typeof m.content === 'string' ? affineDecrypt(m.content) : m.content }));
  }
  if (typeof t.summary === 'string') t.summary = affineDecrypt(t.summary);
  if (t.mindMap && Array.isArray(t.mindMap.nodes)) {
    t.mindMap.nodes = t.mindMap.nodes.map(n => ({ ...n, label: typeof n.label === 'string' ? affineDecrypt(n.label) : n.label }));
  }
  if (t.mindMap && Array.isArray(t.mindMap.edges)) {
    t.mindMap.edges = t.mindMap.edges.map(e => ({ ...e, label: typeof e.label === 'string' ? affineDecrypt(e.label) : e.label }));
  }
  return t;
};

// Get or create user (lookup by email - email is primary identifier)
app.post('/api/users/find-or-create', async (req, res) => {
  try {
    const { googleId, name, email, picture } = req.body;
    if (!email) return res.status(400).json({ error: 'email is required' });

    // Prefer MongoDB when available
    if (usersCol) {
      let user = await usersCol.findOne({ email });
      if (!user) {
        user = {
          id: email, // use email as primary id
          googleId: googleId || null,
          name,
          email,
          picture,
          createdAt: new Date().toISOString(),
        };
        await usersCol.insertOne(user);

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
        await threadsCol.insertOne(encryptThreadForSave(firstThread));
      }

      const rawThreads = await threadsCol.find({ userId: email }).sort({ createdAt: -1 }).toArray();
      const userThreads = rawThreads.map(decryptThreadFromDb);
      return res.json({ user, threads: userThreads });
    }

    // Fallback to in-memory demo DB
    let user = database.users.find(u => u.email === email);
    if (!user) {
      user = { id: email, googleId: googleId || null, name, email, picture };
      database.users.push(user);
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

    if (threadsCol) {
      const userThreadCount = await threadsCol.countDocuments({ userId });
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
      await threadsCol.insertOne(encryptThreadForSave(newThread));
      return res.json(newThread);
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

    if (threadsCol) {
      const existing = await threadsCol.findOne({ id: threadId });
      if (!existing) return res.status(404).json({ error: 'Thread not found' });
      // Decrypt existing, merge with incoming plain updatedData, then encrypt for save
      const decryptedExisting = decryptThreadFromDb(existing);
      const mergedPlain = { ...decryptedExisting, ...updatedData, updatedAt: new Date().toISOString() };
      const toSave = encryptThreadForSave(mergedPlain);
      // preserve _id when replacing
      if (existing._id) toSave._id = existing._id;
      await threadsCol.replaceOne({ id: threadId }, toSave);
      return res.json(mergedPlain);
    }

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

    if (threadsCol) {
      const rawThreads = await threadsCol.find({ userId }).sort({ createdAt: -1 }).toArray();
      const userThreads = rawThreads.map(decryptThreadFromDb);
      return res.json(userThreads);
    }

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