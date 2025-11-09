## Quick repo summary

This is a small full‑stack prototype called Lexora (AI legal assistant).
- Frontend: React + Vite (root). Entry: `index.tsx` -> `App.tsx`.
- Backend: Node + Express in `server/index.js` (Gemini/@google/genai integration).
- Client ↔ Server communication uses a tiny REST JSON API under `/api`.

## Key workflows / dev commands
- Frontend (from repo root):
  - npm install
  - npm run dev  (starts Vite on port 3000)
- Backend (server folder):
  - cd server; npm install
  - npm run dev  (uses nodemon) or npm start (node index.js)

Environment variables
- Backend requires GEMINI_API_KEY (see `server/index.js`). For local dev put it in `server/.env` or a top‑level `.env.local` as the README suggests.
- Frontend can point to the API via `VITE_API_URL` (used in `services/apiService.ts`). Default fallback is `http://localhost:5000/api`.

## High‑level architecture & dataflow (what to know as you edit)
- The frontend calls wrapper functions in `services/apiService.ts`. Those wrappers POST to the server endpoints (e.g. `/process-message`, `/auth/google`, `/users/*`).
- The server calls the Gemini API via `@google/genai`. `server/index.js` constructs a `responseSchema` and `systemInstruction` and asks Gemini to return a JSON object matching that schema.
- The server returns a JSON object with three required fields: `chatResponse`, `summary`, and `mindMap` (see `types.ts` / `GeminiResponse`). The client expects and stores these on the CaseThread.

## API contract -- be strict
- /api/process-message (POST) payload (client-side example in `services/apiService.ts`):
  {
    history: Message[],
    userInput: string,
    imageBase64: string|null,
    isThinkingMode: boolean
  }
- Expected server JSON response: (must be single valid JSON object, no markdown fences)
  {
    chatResponse: string,
    summary: string,
    mindMap: { nodes: [{id, label}], edges: [{source, target, label}] }
  }

Notes: server `systemInstruction` explicitly tells the model: "Provide your output as a single, valid JSON object matching the prescribed schema. Do not include any markdown formatting like ```json```." Keep that invariant when changing schema or prompts.

## Project‑specific patterns and gotchas
- OAuth is mocked for the demo: `services/googleOAuth.tsx` simulates `useGoogleLogin` and `server/index.js` returns mock user data at `/api/auth/google`. Replace both sides if adding real Google OAuth.
- The server stores data in an in‑memory store (variable `database`) for demo purposes. Persistence changes must update both API endpoints and frontend expectations.
- Frontend optimistic updates: `App.tsx` updates threads/messages optimistically then calls `processUserTurn`. Tests/edits should preserve or deliberately change this UX flow.
- Image handling: client sends `imageBase64` (raw base64 string) to server; client code stores/display images via `data:image/jpeg;base64,${base64}` in Message.image (see `App.tsx`). Keep format consistent.
- Types live in `types.ts`. Keep those types in sync with `server/index.js` response schema when editing.

## Where to look for examples
- `server/index.js` — response schema, systemPrompt, routes and error patterns.
- `services/apiService.ts` — client wrappers and API_BASE_URL logic.
- `App.tsx` — optimistic UI, how threads/messages are structured and updated.
- `types.ts` — canonical shapes for User, Message, MindMap, CaseThread, GeminiResponse.

## Small editing rules for AI agents
- When editing prompts or changing the response schema, update `types.ts` and the server schema in `server/index.js` together.
- Keep responses strictly JSON (no markdown fences). The frontend parses the response directly as JSON.
- Preserve the mock OAuth and server in‑memory behavior unless the task explicitly replaces them and updates client code accordingly.

If any of the above is unclear or you need more examples (e.g., sample Gemini payloads or test threads), tell me which piece to expand or change.
