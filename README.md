# NeuroFlow AI

NeuroFlow is not software. It is an AI execution system.
A new operating layer between humans and the digital universe.

## Core Architecture
- **Command Center (/dashboard)**: Advanced task, memory, and proactive suggestion engine.
- **Adaptive Execution**: Framer Motion dictation pill acting as the entry point for all workflows.
- **Multi-App Action Layer**: Live integration with n8n Webhooks to cross-trigger emails, CRM, and Slack silently in the background.
- **Self-Verification Loop**: The system waits for physical confirmation of an action before confirming completion to the user.
- **Memory Matrix**: Pinecone integration parsing user preferences via Gemini into persistent memory.
- **Extension Layer**: "Ghost-typing" DOM manipulation allowing NeuroFlow to write exactly where your cursor is seamlessly.

## Tech Stack
- **Frontend**: Next.js App Router, Tailwind CSS, Framer Motion
- **Backend API**: Next.js Edge Routes
- **Execution Validation**: n8n Multi-App Execution
- **LLM Engine**: Gemini 2.5 Flash / Semantic Embeddings (text-embedding-004)
- **Database**: Supabase (Auth/Postgres) + Pinecone (Vectors)
- **Deployment**: Vercel

*Built by Abhishek Jaiswal.*
