import express from 'express';
import { v4 as uuidv4 } from 'uuid';

const app = express();
const PORT = 5679;

app.use(express.json());

// In-memory storage for workflows
const workflows = new Map();

// CORS middleware
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  next();
});

// Get all workflows
app.get('/api/workflows', (req, res) => {
  res.json(Array.from(workflows.values()));
});

// Get single workflow
app.get('/api/workflows/:id', (req, res) => {
  const workflow = workflows.get(req.params.id);
  if (!workflow) {
    return res.status(404).json({ error: 'Workflow not found' });
  }
  res.json(workflow);
});

// Create workflow
app.post('/api/workflows', (req, res) => {
  const workflow = {
    id: uuidv4(),
    name: req.body.name || 'Untitled Workflow',
    nodes: req.body.nodes || [],
    connections: req.body.connections || [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  workflows.set(workflow.id, workflow);
  res.status(201).json(workflow);
});

// Update workflow
app.put('/api/workflows/:id', (req, res) => {
  const workflow = workflows.get(req.params.id);
  if (!workflow) {
    return res.status(404).json({ error: 'Workflow not found' });
  }
  
  const updated = {
    ...workflow,
    name: req.body.name || workflow.name,
    nodes: req.body.nodes || workflow.nodes,
    connections: req.body.connections || workflow.connections,
    updatedAt: new Date().toISOString()
  };
  
  workflows.set(req.params.id, updated);
  res.json(updated);
});

// Delete workflow
app.delete('/api/workflows/:id', (req, res) => {
  const deleted = workflows.delete(req.params.id);
  if (!deleted) {
    return res.status(404).json({ error: 'Workflow not found' });
  }
  res.status(204).send();
});

// Execute workflow
app.post('/api/workflows/:id/execute', (req, res) => {
  const workflow = workflows.get(req.params.id);
  if (!workflow) {
    return res.status(404).json({ error: 'Workflow not found' });
  }

  // Simple execution simulation
  const results = workflow.nodes.map(node => ({
    nodeId: node.id,
    nodeName: node.name,
    type: node.type,
    status: 'success',
    executedAt: new Date().toISOString(),
    data: {
      message: `${node.type} node executed successfully`,
      input: node.parameters
    }
  }));

  res.json({
    workflowId: workflow.id,
    status: 'success',
    startedAt: new Date().toISOString(),
    finishedAt: new Date().toISOString(),
    results
  });
});

app.listen(PORT, () => {
  console.log(`🚀 n8n MVP Server running on http://localhost:${PORT}`);
});
