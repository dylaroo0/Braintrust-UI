# Braintrust Circle MVP

A React/TypeScript application powered by Google's Gemini AI API for intelligent conversations and task management.

## Features

- AI-powered chat interface using Gemini API
- Task management and organization
- Agent-based interactions
- Real-time WebSocket communication
- Modern React 19 with TypeScript

## Prerequisites

- Node.js (v16 or higher)
- A Google Gemini API key

## Setup

1. **Clone the repository:**
   ```bash
   git clone <your-repo-url>
   cd braintrust-circle-mvp
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   Create a `.env.local` file in the root directory and add your API keys:
   ```
   GEMINI_API_KEY=your_gemini_api_key_here
   OPENROUTER_API_KEY=your_openrouter_api_key_here
   ```

4. **Run the development server:**
   ```bash
   npm run dev
   ```

5. **Open your browser:**
   Navigate to `http://localhost:5173` to see the app running.

## Available Scripts

- `npm run dev` - Start development server
- `npm run dev:alt` - Start development server on port 5174
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## Tech Stack

- **Frontend:** React 19, TypeScript, Vite
- **AI Integration:** Google Gemini API
- **Communication:** WebSockets (ws)
- **Backend:** Express.js

## Project Structure

```
├── components/          # React components
├── services/           # API services
├── dist/              # Build output
├── .env.local         # Environment variables (not tracked)
└── ...
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is private and proprietary.
