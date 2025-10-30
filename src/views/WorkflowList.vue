<template>
  <div class="workflow-list">
    <div class="container">
      <div class="header">
        <h2>My Workflows</h2>
        <button @click="createWorkflow" class="btn btn-primary">
          + New Workflow
        </button>
      </div>

      <div v-if="loading" class="loading">Loading workflows...</div>

      <div v-else-if="workflows.length === 0" class="empty-state">
        <p>No workflows yet. Create your first workflow to get started!</p>
      </div>

      <div v-else class="workflows-grid">
        <div
          v-for="workflow in workflows"
          :key="workflow.id"
          class="workflow-card"
        >
          <div class="workflow-header">
            <h3>{{ workflow.name }}</h3>
            <div class="workflow-actions">
              <button @click="openEditor(workflow.id)" class="btn btn-sm">
                Edit
              </button>
              <button @click="executeWorkflow(workflow.id)" class="btn btn-sm btn-success">
                Run
              </button>
              <button @click="deleteWorkflow(workflow.id)" class="btn btn-sm btn-danger">
                Delete
              </button>
            </div>
          </div>
          <div class="workflow-meta">
            <span>{{ workflow.nodes.length }} nodes</span>
            <span>Updated: {{ formatDate(workflow.updatedAt) }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

const router = useRouter()
const workflows = ref([])
const loading = ref(true)

const fetchWorkflows = async () => {
  try {
    const response = await axios.get('/api/workflows')
    workflows.value = response.data
  } catch (error) {
    console.error('Failed to fetch workflows:', error)
  } finally {
    loading.value = false
  }
}

const createWorkflow = async () => {
  try {
    const response = await axios.post('/api/workflows', {
      name: 'New Workflow',
      nodes: [],
      connections: []
    })
    router.push(`/editor/${response.data.id}`)
  } catch (error) {
    console.error('Failed to create workflow:', error)
  }
}

const openEditor = (id) => {
  router.push(`/editor/${id}`)
}

const executeWorkflow = async (id) => {
  try {
    const response = await axios.post(`/api/workflows/${id}/execute`)
    alert(`Workflow executed successfully!\n\nResults: ${response.data.results.length} nodes executed`)
  } catch (error) {
    console.error('Failed to execute workflow:', error)
    alert('Failed to execute workflow')
  }
}

const deleteWorkflow = async (id) => {
  if (!confirm('Are you sure you want to delete this workflow?')) return
  
  try {
    await axios.delete(`/api/workflows/${id}`)
    workflows.value = workflows.value.filter(w => w.id !== id)
  } catch (error) {
    console.error('Failed to delete workflow:', error)
  }
}

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

onMounted(() => {
  fetchWorkflows()
})
</script>

<style scoped>
.workflow-list {
  padding: 2rem 0;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.header h2 {
  margin: 0;
  font-size: 2rem;
  color: #333;
}

.loading,
.empty-state {
  text-align: center;
  padding: 3rem;
  color: #666;
  font-size: 1.1rem;
}

.workflows-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 1.5rem;
}

.workflow-card {
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 1.5rem;
  transition: box-shadow 0.2s;
}

.workflow-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.workflow-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
}

.workflow-header h3 {
  margin: 0;
  font-size: 1.3rem;
  color: #333;
}

.workflow-actions {
  display: flex;
  gap: 0.5rem;
}

.workflow-meta {
  display: flex;
  gap: 1rem;
  color: #666;
  font-size: 0.9rem;
}

.btn {
  padding: 0.6rem 1.2rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s;
}

.btn-primary {
  background: #667eea;
  color: white;
}

.btn-primary:hover {
  background: #5568d3;
}

.btn-sm {
  padding: 0.4rem 0.8rem;
  font-size: 0.85rem;
  background: #f5f5f5;
  color: #333;
}

.btn-sm:hover {
  background: #e0e0e0;
}

.btn-success {
  background: #10b981;
  color: white;
}

.btn-success:hover {
  background: #059669;
}

.btn-danger {
  background: #ef4444;
  color: white;
}

.btn-danger:hover {
  background: #dc2626;
}
</style>
