<template>
  <div class="workflow-editor">
    <div class="editor-header">
      <div class="container">
        <input
          v-model="workflowName"
          @blur="saveWorkflow"
          class="workflow-name-input"
          placeholder="Workflow name"
        />
        <div class="editor-actions">
          <button @click="addNode" class="btn btn-primary">+ Add Node</button>
          <button @click="executeWorkflow" class="btn btn-success">▶ Execute</button>
          <button @click="saveWorkflow" class="btn">💾 Save</button>
        </div>
      </div>
    </div>

    <div class="editor-content">
      <div class="canvas" ref="canvasRef" @drop="onDrop" @dragover.prevent>
        <div
          v-for="node in nodes"
          :key="node.id"
          class="node"
          :style="{
            left: node.position.x + 'px',
            top: node.position.y + 'px'
          }"
          draggable="true"
          @dragstart="startDrag(node, $event)"
          @click="selectNode(node)"
          :class="{ selected: selectedNode?.id === node.id }"
        >
          <div class="node-header">
            <span class="node-icon">{{ getNodeIcon(node.type) }}</span>
            <span class="node-name">{{ node.name }}</span>
            <button @click.stop="deleteNode(node.id)" class="node-delete">×</button>
          </div>
          <div class="node-type">{{ node.type }}</div>
        </div>

        <svg class="connections" :style="{ width: '100%', height: '100%' }">
          <path
            v-for="(connection, index) in connections"
            :key="index"
            :d="getConnectionPath(connection)"
            stroke="#667eea"
            stroke-width="2"
            fill="none"
          />
        </svg>
      </div>

      <div v-if="selectedNode" class="node-properties">
        <h3>Node Properties</h3>
        <div class="property">
          <label>Name:</label>
          <input v-model="selectedNode.name" @input="saveWorkflow" />
        </div>
        <div class="property">
          <label>Type:</label>
          <select v-model="selectedNode.type" @change="saveWorkflow">
            <option value="trigger">Trigger</option>
            <option value="action">Action</option>
            <option value="condition">Condition</option>
            <option value="transform">Transform</option>
          </select>
        </div>
        <div class="property">
          <label>Parameters:</label>
          <textarea
            v-model="selectedNode.parameters"
            @input="saveWorkflow"
            rows="5"
            placeholder="Enter JSON parameters"
          ></textarea>
        </div>
      </div>
    </div>

    <div v-if="executionResult" class="execution-result">
      <div class="result-header">
        <h3>Execution Result</h3>
        <button @click="executionResult = null" class="btn btn-sm">✕</button>
      </div>
      <pre>{{ JSON.stringify(executionResult, null, 2) }}</pre>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import axios from 'axios'
import { v4 as uuidv4 } from 'uuid'

const route = useRoute()
const workflowId = computed(() => route.params.id)

const workflowName = ref('Untitled Workflow')
const nodes = ref([])
const connections = ref([])
const selectedNode = ref(null)
const executionResult = ref(null)
const canvasRef = ref(null)
const draggedNode = ref(null)

const loadWorkflow = async () => {
  if (!workflowId.value) return

  try {
    const response = await axios.get(`/api/workflows/${workflowId.value}`)
    workflowName.value = response.data.name
    nodes.value = response.data.nodes
    connections.value = response.data.connections
  } catch (error) {
    console.error('Failed to load workflow:', error)
  }
}

const saveWorkflow = async () => {
  if (!workflowId.value) return

  try {
    await axios.put(`/api/workflows/${workflowId.value}`, {
      name: workflowName.value,
      nodes: nodes.value,
      connections: connections.value
    })
  } catch (error) {
    console.error('Failed to save workflow:', error)
  }
}

const addNode = () => {
  const newNode = {
    id: uuidv4(),
    name: `Node ${nodes.value.length + 1}`,
    type: 'action',
    position: {
      x: 100 + nodes.value.length * 50,
      y: 100 + nodes.value.length * 50
    },
    parameters: '{}'
  }
  nodes.value.push(newNode)
  saveWorkflow()
}

const deleteNode = (nodeId) => {
  nodes.value = nodes.value.filter(n => n.id !== nodeId)
  connections.value = connections.value.filter(
    c => c.source !== nodeId && c.target !== nodeId
  )
  if (selectedNode.value?.id === nodeId) {
    selectedNode.value = null
  }
  saveWorkflow()
}

const selectNode = (node) => {
  selectedNode.value = node
}

const startDrag = (node, event) => {
  draggedNode.value = node
  event.dataTransfer.effectAllowed = 'move'
}

const onDrop = (event) => {
  if (!draggedNode.value) return

  const rect = canvasRef.value.getBoundingClientRect()
  draggedNode.value.position = {
    x: event.clientX - rect.left - 75,
    y: event.clientY - rect.top - 25
  }

  draggedNode.value = null
  saveWorkflow()
}

const getNodeIcon = (type) => {
  const icons = {
    trigger: '⚡',
    action: '⚙️',
    condition: '🔀',
    transform: '🔄'
  }
  return icons[type] || '📦'
}

const getConnectionPath = (connection) => {
  const sourceNode = nodes.value.find(n => n.id === connection.source)
  const targetNode = nodes.value.find(n => n.id === connection.target)

  if (!sourceNode || !targetNode) return ''

  const x1 = sourceNode.position.x + 75
  const y1 = sourceNode.position.y + 40
  const x2 = targetNode.position.x + 75
  const y2 = targetNode.position.y + 40

  return `M ${x1} ${y1} L ${x2} ${y2}`
}

const executeWorkflow = async () => {
  if (!workflowId.value) return

  try {
    const response = await axios.post(`/api/workflows/${workflowId.value}/execute`)
    executionResult.value = response.data
  } catch (error) {
    console.error('Failed to execute workflow:', error)
    alert('Failed to execute workflow')
  }
}

onMounted(() => {
  loadWorkflow()
})
</script>

<style scoped>
.workflow-editor {
  height: calc(100vh - 80px);
  display: flex;
  flex-direction: column;
}

.editor-header {
  background: white;
  border-bottom: 1px solid #e0e0e0;
  padding: 1rem 0;
}

.editor-header .container {
  max-width: 100%;
  margin: 0 auto;
  padding: 0 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.workflow-name-input {
  font-size: 1.5rem;
  font-weight: 600;
  border: none;
  border-bottom: 2px solid transparent;
  padding: 0.5rem;
  outline: none;
  transition: border-color 0.2s;
}

.workflow-name-input:focus {
  border-bottom-color: #667eea;
}

.editor-actions {
  display: flex;
  gap: 1rem;
}

.editor-content {
  display: flex;
  flex: 1;
  overflow: hidden;
}

.canvas {
  flex: 1;
  background: #f9fafb;
  background-image: radial-gradient(#e5e7eb 1px, transparent 1px);
  background-size: 20px 20px;
  position: relative;
  overflow: auto;
}

.connections {
  position: absolute;
  top: 0;
  left: 0;
  pointer-events: none;
}

.node {
  position: absolute;
  width: 150px;
  background: white;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  cursor: move;
  transition: all 0.2s;
}

.node:hover,
.node.selected {
  border-color: #667eea;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.2);
  z-index: 10;
}

.node-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem;
  border-bottom: 1px solid #f0f0f0;
}

.node-icon {
  font-size: 1.2rem;
}

.node-name {
  flex: 1;
  font-weight: 600;
  font-size: 0.9rem;
}

.node-delete {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #999;
  padding: 0;
  width: 20px;
  height: 20px;
  line-height: 1;
}

.node-delete:hover {
  color: #ef4444;
}

.node-type {
  padding: 0.5rem 0.75rem;
  font-size: 0.8rem;
  color: #666;
  text-transform: uppercase;
}

.node-properties {
  width: 300px;
  background: white;
  border-left: 1px solid #e0e0e0;
  padding: 1.5rem;
  overflow-y: auto;
}

.node-properties h3 {
  margin-top: 0;
  margin-bottom: 1.5rem;
  color: #333;
}

.property {
  margin-bottom: 1.5rem;
}

.property label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #555;
}

.property input,
.property select,
.property textarea {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  font-family: inherit;
}

.property textarea {
  resize: vertical;
  font-family: monospace;
}

.execution-result {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  max-height: 40vh;
  background: white;
  border-top: 2px solid #667eea;
  box-shadow: 0 -4px 12px rgba(0, 0, 0, 0.1);
  overflow-y: auto;
}

.result-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  border-bottom: 1px solid #e0e0e0;
}

.result-header h3 {
  margin: 0;
}

.execution-result pre {
  padding: 1.5rem 2rem;
  margin: 0;
  overflow-x: auto;
  font-size: 0.9rem;
  background: #f9fafb;
}

.btn {
  padding: 0.6rem 1.2rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s;
  background: #f5f5f5;
  color: #333;
}

.btn:hover {
  background: #e0e0e0;
}

.btn-primary {
  background: #667eea;
  color: white;
}

.btn-primary:hover {
  background: #5568d3;
}

.btn-success {
  background: #10b981;
  color: white;
}

.btn-success:hover {
  background: #059669;
}

.btn-sm {
  padding: 0.4rem 0.8rem;
  font-size: 0.85rem;
}
</style>
