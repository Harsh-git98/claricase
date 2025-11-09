import { User, CaseThread } from '../types';

// Simple UUID generator to avoid external dependencies
const uuid = () => 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
});

const DB_KEY = 'lexora_db';

interface Database {
  users: User[];
  threads: CaseThread[];
}

const getDB = (): Database => {
  try {
    const db = localStorage.getItem(DB_KEY);
    return db ? JSON.parse(db) : { users: [], threads: [] };
  } catch (error) {
    console.error("Error reading from localStorage", error);
    return { users: [], threads: [] };
  }
};

const saveDB = (db: Database) => {
  try {
    localStorage.setItem(DB_KEY, JSON.stringify(db));
  } catch (error) {
    console.error("Error writing to localStorage", error);
  }
};

export const findOrCreateUser = async (profile: Omit<User, 'id'>): Promise<{ user: User, threads: CaseThread[] }> => {
  return new Promise(resolve => {
    setTimeout(() => { // Simulate network latency
        const db = getDB();
        let user = db.users.find(u => u.googleId === profile.googleId);
        
        if (!user) {
            user = { ...profile, id: profile.googleId };
            db.users.push(user);
            
            const firstThread: CaseThread = {
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
            db.threads.push(firstThread);
            saveDB(db);
        }

        const userThreads = db.threads
            .filter(t => t.userId === user!.id)
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
            
        resolve({ user, threads: userThreads });
    }, 300);
  });
};

export const createThread = async (userId: string): Promise<CaseThread> => {
    return new Promise(resolve => {
        const db = getDB();
        const newThread: CaseThread = {
            id: uuid(),
            userId: userId,
            title: `Case #${db.threads.filter(t => t.userId === userId).length + 1}`,
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
        db.threads.push(newThread);
        saveDB(db);
        resolve(newThread);
    });
};

export const updateThread = async (threadId: string, updatedData: Partial<CaseThread>): Promise<CaseThread | null> => {
     return new Promise(resolve => {
        const db = getDB();
        const threadIndex = db.threads.findIndex(t => t.id === threadId);
        if (threadIndex > -1) {
            db.threads[threadIndex] = { ...db.threads[threadIndex], ...updatedData, updatedAt: new Date().toISOString() };
            saveDB(db);
            resolve(db.threads[threadIndex]);
        } else {
            resolve(null);
        }
     });
};
