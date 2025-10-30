# n8n Workflow MVP

A simplified MVP version of [n8n](https://github.com/n8n-io/n8n) - a visual workflow automation platform.

## 🎯 Features

This MVP demonstrates the core workflow automation concept with:

- **Visual Workflow Editor**: Drag-and-drop node-based workflow creation
- **Multiple Node Types**: Trigger, Action, Condition, and Transform nodes
- **Workflow Management**: Create, edit, save, and delete workflows
- **Workflow Execution**: Run workflows and view execution results
- **Real-time Updates**: Auto-save workflow changes
- **Responsive UI**: Clean, modern interface inspired by n8n

## 🚀 Quick Start

### Prerequisites

- Node.js >= 20.19
- npm or pnpm

### Installation

```bash
# Install dependencies
npm install

# Start development server (runs both backend and frontend)
npm run dev
```

The application will be available at:
- Frontend: http://localhost:5678
- Backend API: http://localhost:5679

### Production Build

```bash
# Build the frontend
npm run build

# Preview the production build
npm run preview

# Or start the backend server
npm start
```

## 📁 Project Structure

```
n8n-workflow-mvp/
├── server/              # Express backend
│   └── index.js        # API server with workflow endpoints
├── src/
│   ├── views/          # Vue components
│   │   ├── WorkflowList.vue    # Workflow listing page
│   │   └── WorkflowEditor.vue  # Visual workflow editor
│   ├── router/         # Vue Router configuration
│   ├── App.vue         # Main app component
│   ├── main.js         # App entry point
│   └── style.css       # Global styles
├── package.json
├── vite.config.js      # Vite configuration
└── index.html
```

## 🛠️ Technology Stack

Matching the parent repository's stack:

### Backend
- **Express** 5.1.0 - Web server framework
- **axios** 1.12.0 - HTTP client
- **uuid** 10.0.0 - Unique ID generation

### Frontend
- **Vue.js** 3.5.13 - Progressive JavaScript framework
- **Vue Router** 4.5.0 - Official router for Vue.js
- **Pinia** 2.2.4 - State management
- **@vueuse/core** 10.11.0 - Collection of Vue composition utilities
- **Vite** 6.0.5 - Next generation frontend tooling

## 🎮 Usage

1. **Create a Workflow**
   - Click "New Workflow" on the home page
   - You'll be redirected to the visual editor

2. **Build Your Workflow**
   - Click "+ Add Node" to create workflow nodes
   - Drag nodes to position them on the canvas
   - Click a node to view and edit its properties
   - Set node types: Trigger, Action, Condition, or Transform

3. **Execute Workflow**
   - Click "▶ Execute" to run the workflow
   - View execution results in the bottom panel

4. **Manage Workflows**
   - All changes are auto-saved
   - Navigate back to home to see all workflows
   - Run, edit, or delete workflows from the list

## 🔌 API Endpoints

- `GET /api/workflows` - List all workflows
- `GET /api/workflows/:id` - Get single workflow
- `POST /api/workflows` - Create new workflow
- `PUT /api/workflows/:id` - Update workflow
- `DELETE /api/workflows/:id` - Delete workflow
- `POST /api/workflows/:id/execute` - Execute workflow

## 🎨 What's Different from n8n?

This MVP simplifies the original n8n by:

- **No Authentication**: Removed user management and auth flows
- **In-Memory Storage**: Uses Map instead of database (SQLite/PostgreSQL)
- **Simplified Nodes**: Basic node types without actual integrations
- **No External Services**: Removed 400+ third-party integrations
- **Single Environment**: No worker/webhook separation
- **Mock Execution**: Simulated workflow execution without real processing
- **Removed Features**: No AI capabilities, templates, or advanced permissions

## 📝 Parent Repository

Based on [n8n-io/n8n](https://github.com/n8n-io/n8n)

## 📄 License

MIT License - This is an educational MVP and not affiliated with n8n.io
