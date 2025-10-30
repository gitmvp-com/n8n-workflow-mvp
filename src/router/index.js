import { createRouter, createWebHistory } from 'vue-router'
import WorkflowList from '../views/WorkflowList.vue'
import WorkflowEditor from '../views/WorkflowEditor.vue'

const routes = [
  {
    path: '/',
    name: 'workflows',
    component: WorkflowList
  },
  {
    path: '/editor/:id?',
    name: 'editor',
    component: WorkflowEditor
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
