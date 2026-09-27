# 📝 NoteAI Agent

A modern full-stack AI-powered note management application that allows users to create, search, update, organize, and delete notes using natural language and voice dictation. Powered by **Google Gemini** via the **Vercel AI SDK**, with tool/function calling for automated database actions.

---

## ✨ Features

- 🤖 **Autonomous AI Agent**: Natural language assistant capable of interpreting user intent and executing note actions via function/tool calling.
- 🎙️ **Voice Dictation**: Built-in speech recognition (Web Speech API) allowing hands-free voice commands to add, search, or modify notes.
- 🛠️ **Multi-Action Tool Suite**:
  - `create_note`: Capture ideas and to-dos instantly from natural conversation.
  - `search_note`: Semantic and keyword search across personal notes.
  - `update_note`: Identify and edit existing notes seamlessly.
  - `mark_note_completed`: Toggle task completion state.
  - `delete_note` & `delete_all_notes`: Granular deletion by content/ID or bulk cleanup with guardrails.
- 🔐 **Authentication & Security**:
  - Secure user registration and login with bcrypt password hashing.
  - JWT authentication using HTTP-only cookies (access & refresh tokens).
  - Schema validation with Zod on both client and server.
  - HTTP security headers with Helmet and strict CORS configuration.
- 🎨 **Modern Sleek UI**:
  - Built with React 19, Vite, and Tailwind CSS v4.
  - Component primitives from Shadcn UI & Base UI.
  - Fluid animations, interactive feedback, and toast notifications (Sonner).
  - Geist Variable typography.
- 🗄️ **Robust Data Persistence**: PostgreSQL database modeled and migrated using Prisma ORM.

---

## 🛠️ Tech Stack

### Client (Frontend)
- **Framework**: [React 19](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **State Management**: [Redux Toolkit](https://redux-toolkit.js.org/) + React-Redux
- **Forms & Validation**: React Hook Form + Zod
- **Icons & UI**: Lucide React, Sonner, Shadcn UI / Base UI
- **Voice Recognition**: Web Speech API (`SpeechRecognition`)
- **HTTP Client**: Axios with credentials & cookie support

### Server (Backend)
- **Runtime**: [Node.js](https://nodejs.org/) (ES Modules)
- **Framework**: [Express 5](https://expressjs.com/) + TypeScript
- **AI Engine**: [Vercel AI SDK](https://sdk.vercel.ai/) (`ai`) + [Google Generative AI](https://ai.google.dev/) (`@ai-sdk/google`)
- **Database & ORM**: [PostgreSQL](https://www.postgresql.org/) + [Prisma ORM](https://www.prisma.io/) (`@prisma/adapter-pg`)
- **Authentication**: JSON Web Tokens (`jsonwebtoken`), `cookie-parser`, `bcrypt`
- **Security & Validation**: `helmet`, `cors`, `zod`

---

## 📁 Project Structure

```text
NoteAiAgent/
├── client/                     # Vite + React Frontend
│   ├── src/
│   │   ├── api/                # API client functions (auth, agent, notes)
│   │   ├── components/         # Reusable UI & Dashboard components
│   │   ├── pages/              # Dashboard, Login, Register pages
│   │   ├── routes/             # App routing and route protection
│   │   ├── store/              # Redux Toolkit state slices
│   │   └── types/              # TypeScript type definitions
│   ├── .env.example
│   └── package.json
│
├── server/                     # Express + Prisma Backend
│   ├── prisma/
│   │   ├── schema.prisma       # Database schema (User & Note models)
│   │   └── migrations/         # Prisma migration history
│   ├── src/
│   │   ├── ai/                 # AI agent setup & tool definitions
│   │   ├── controllers/        # Request handlers (auth, notes, agent)
│   │   ├── middlewares/        # Auth, error, and validation middlewares
│   │   ├── routes/             # Express API routes
│   │   ├── services/           # Note & database business logic
│   │   └── validations/        # Zod validation schemas
│   ├── .env.example
│   └── package.json
│
├── package.json                # Root package orchestration
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18.x or v20.x+ recommended)
- [PostgreSQL](https://www.postgresql.org/) database running locally or hosted (e.g. Supabase, Neon)
- [Google Gemini API Key](https://aistudio.google.com/) for AI agent capabilities

---

### 1. Clone the Repository

```bash
git clone https://github.com/princepal09/NoteAiAgent.git
cd NoteAiAgent
```

---

### 2. Environment Variables Configuration

#### Backend (`server/.env`)
Create a `.env` file in the `server` directory:

```bash
cp server/.env.example server/.env
```

Populate the values:

```env
PORT=5000
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173

# PostgreSQL Connection String
DATABASE_URL="postgresql://user:password@localhost:5432/noteai?schema=public"

# Google Gemini API Key
GOOGLE_GENERATIVE_AI_API_KEY="your_google_ai_studio_api_key"

# JWT Secrets & Expirations
JWT_TOKEN_ACCESS_SECRET="your_jwt_access_secret_key"
JWT_TOKEN_REFRESH_SECRET="your_jwt_refresh_secret_key"
ACCESS_TOKEN_EXPIRY="1d"
REFRESH_TOKEN_EXPIRY="7d"
```

#### Frontend (`client/.env`)
Create a `.env` file in the `client` directory:

```bash
cp client/.env.example client/.env
```

Populate the values:

```env
VITE_BACKEND_URL=http://localhost:5000/api/v1
```

---

### 3. Install Dependencies

You can install dependencies for the root, server, and client:

```bash
# Root dependencies
npm install

# Server dependencies
cd server && npm install && cd ..

# Client dependencies
cd client && npm install && cd ..
```

---

### 4. Database Setup & Migrations

From the `server` directory:

```bash
# Run database migrations
npm run db:migrate --prefix server

# Generate Prisma client
npm run db:generate --prefix server
```

*(Optional)* Open Prisma Studio to inspect your database visually:
```bash
npm run db:studio --prefix server
```

---

### 5. Running the Application

You can start both the client and server concurrently from the root directory:

```bash
npm run dev
```

Or run them individually in separate terminals:

```bash
# Terminal 1 - Start Server (runs on http://localhost:5000)
npm run server

# Terminal 2 - Start Client (runs on http://localhost:5173)
npm run client
```

Navigate to **http://localhost:5173** in your browser.

---

## 🧠 AI Agent Usage & Examples

Once logged in, open the Dashboard and interact with the AI assistant via text input or the **Microphone** icon:

| Action | Example Prompt / Voice Command |
| :--- | :--- |
| **Create Note** | *"Add a note: Buy groceries tomorrow at 6 PM"* |
| **Search Notes** | *"Find all notes related to meetings"* |
| **Mark Complete** | *"Mark the grocery shopping note as completed"* |
| **Update Note** | *"Update my meeting note to say Friday at 3 PM"* |
| **Delete Note** | *"Delete the note about groceries"* |
| **Clear All** | *"Delete all my notes"* *(safeguarded with confirmation)* |

---

## 📡 API Reference

Base URL: `/api/v1`

### Authentication (`/user`)
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :---: |
| `POST` | `/user/register` | Register a new user | ❌ |
| `POST` | `/user/login` | Login and receive auth cookies | ❌ |
| `POST` | `/user/logout` | Clear auth cookies | ✅ |
| `GET` | `/user/currentUser` | Get authenticated user profile | ✅ |

### AI Agent (`/agent`)
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :---: |
| `POST` | `/agent/chat` | Send natural language/voice command to AI | ✅ |

### Notes (`/note`)
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :---: |
| `GET` | `/note/all-notes` | Fetch all notes for authenticated user | ✅ |

---

## 📜 Available Scripts

### Root Directory
- `npm run dev` - Runs both client and server concurrently.
- `npm run server` - Runs the backend in watch mode via `tsx`.
- `npm run client` - Runs the frontend Vite dev server.

### Server Directory (`/server`)
- `npm run dev` - Starts development server with `tsx watch`.
- `npm run build` - Compiles TypeScript to `dist/`.
- `npm run start` - Runs the compiled application with `node`.
- `npm run db:migrate` - Runs Prisma migrations.
- `npm run db:generate` - Generates Prisma client types.
- `npm run db:studio` - Launches Prisma Studio GUI.

### Client Directory (`/client`)
- `npm run dev` - Starts Vite dev server with Hot Module Replacement (HMR).
- `npm run build` - Type-checks and builds the production bundle.
- `npm run lint` - Runs Oxlint.
- `npm run preview` - Locally previews the production build.

---

## 📄 License

This project is licensed under the [ISC License](LICENSE).
