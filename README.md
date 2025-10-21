# Duestack Frontend

A modern Vue.js application built with Vue 3, Vite, Vue Router, and Pinia.

## Tech Stack

- **Vue 3** - Progressive JavaScript Framework
- **Vite** - Next Generation Frontend Tooling
- **Vue Router** - Official router for Vue.js
- **Pinia** - Intuitive state management for Vue

## Project Setup

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository (if not already cloned)
2. Install dependencies:

```bash
npm install
```

### Development

Run the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:3000`

### Build for Production

Build the application for production:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

## Project Structure

```
src/
├── assets/          # Static assets and global styles
├── components/      # Reusable Vue components
├── router/          # Vue Router configuration
├── stores/          # Pinia stores for state management
├── views/           # Page components
├── App.vue          # Root component
└── main.js          # Application entry point
```

## Recommended IDE Setup

- [VS Code](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar)

## Features

- ⚡️ Lightning-fast HMR with Vite
- 🎯 Composition API with `<script setup>`
- 🚦 File-based routing with Vue Router
- 📦 State management with Pinia
- 🎨 Modern and responsive UI

## Getting Started

After running the development server, you can:

1. Edit `src/views/HomeView.vue` to customize the home page
2. Add new components in `src/components/`
3. Create new pages in `src/views/` and add routes in `src/router/index.js`
4. Manage global state using Pinia stores in `src/stores/`

Happy coding! 🚀
