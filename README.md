# AI Task Assistant - Next.js

A modern, AI-powered task management application with an interactive whiteboard interface. Built with Next.js 14, React, TypeScript, and Tailwind CSS.

## Features

- **AI-Powered Task Generation**: Let AI create comprehensive task breakdowns from your project descriptions
- **Interactive Whiteboard**: Visualize and organize tasks on a drag-and-drop whiteboard interface
- **Smart Priority Management**: Automatically prioritize tasks based on dependencies and urgency
- **Team Collaboration**: Assign tasks to team members and track progress in real-time
- **Progress Analytics**: Get insights into productivity patterns and project completion rates
- **Bulk Operations**: Edit multiple tasks simultaneously with bulk edit functionality

## Technology Stack

- **Framework**: Next.js 14 (App Router)
- **Frontend**: React 18, TypeScript
- **Styling**: Tailwind CSS with custom design system
- **UI Components**: shadcn/ui (Radix UI primitives)
- **Animations**: Framer Motion
- **Drag & Drop**: @dnd-kit/core
- **State Management**: Zustand
- **Data Fetching**: TanStack Query (React Query)
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm, yarn, or pnpm

### Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
# or
yarn install
# or
pnpm install
```

3. Run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── globals.css        # Global styles and design system
│   ├── layout.tsx         # Root layout component
│   ├── page.tsx          # Home page
│   ├── not-found.tsx     # 404 page
│   └── providers.tsx     # App providers wrapper
├── components/
│   ├── ai-assistant/     # AI assistant widget components
│   │   ├── whiteboard/   # Whiteboard-specific components
│   │   ├── ai-assistant-widget.tsx
│   │   ├── chat-interface.tsx
│   │   └── task-preview.tsx
│   └── ui/              # Reusable UI components (shadcn/ui)
├── hooks/               # Custom React hooks
├── lib/                 # Utility functions
├── store/              # Zustand state management
├── types/              # TypeScript type definitions
└── vite-env.d.ts       # Vite type definitions
```

## Key Features

### AI Assistant Widget
- Floating widget with chat interface
- AI-powered task generation
- Task preview and organization
- Responsive design for all screen sizes

### Interactive Whiteboard
- Drag-and-drop task cards
- Zoom and pan controls
- Bulk selection and editing
- Task details editing
- Auto-layout functionality

### Design System
- Futuristic glass morphism design
- Dark/light mode support
- Semantic color tokens
- Consistent spacing and typography
- Custom animations and effects

## Development

### Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Design System

The project uses a custom design system built with Tailwind CSS featuring:
- HSL color values for better theming
- Glass morphism effects
- Gradient backgrounds
- Semantic color tokens
- Responsive design utilities

### State Management

Using Zustand for state management with stores for:
- AI Assistant widget state
- Task management
- Whiteboard settings
- Chat messages

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/f688a99d-45cb-4ea0-969b-3c9d77c47da5) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)
