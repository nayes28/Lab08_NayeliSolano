// src/stores/projects.ts
import { defineStore } from 'pinia'

export interface Task {
  id: number
  name: string
  completed: boolean
}

export interface Project {
  id: number
  name: string
  tasks: Task[]
}

export const useProjectsStore = defineStore('projects', {
  state: () => ({
    projects: [] as Project[],
    selectedProjectId: null as number | null,
    nextProjectId:  1,
    nextTaskId:     1,
  }),

  getters: {
    selectedProject(state): Project | null {
      return state.projects.find(p => p.id === state.selectedProjectId) ?? null
    },
    projectProgress(): number {
      const p = this.selectedProject
      if (!p || p.tasks.length === 0) return 0
      const done = p.tasks.filter(t => t.completed).length
      return Math.round((done / p.tasks.length) * 100)
    }
  },

  actions: {
    selectProject(id: number | null) {
      this.selectedProjectId = id
    },

    addProject(name: string) {
      this.projects.push({
        id: this.nextProjectId++,
        name,
        tasks: []
      })
    },

   
   removeProject(id: number) {
      // 1) Elimino el proyecto de la lista
      this.projects = this.projects.filter(p => p.id !== id)
      // 2) Si ese proyecto estaba seleccionado, deselecciono
      if (this.selectedProjectId === id) {
        this.selectedProjectId = null
      }
    },

    updateProjectName(id: number, newName: string) {
      const p = this.projects.find(p => p.id === id)
      if (p) p.name = newName
    },

    addTask(projectId: number, name: string) {
      const p = this.projects.find(p => p.id === projectId)
      if (!p) return
      p.tasks.push({
        id: this.nextTaskId++,
        name,
        completed: false
      })
    },

    removeTask(projectId: number, taskId: number) {
      const p = this.projects.find(p => p.id === projectId)
      if (!p) return
      p.tasks = p.tasks.filter(t => t.id !== taskId)
    },

    toggleTask(projectId: number, taskId: number) {
      const p = this.projects.find(p => p.id === projectId)
      const t = p?.tasks.find(t => t.id === taskId)
      if (t) t.completed = !t.completed
    },

    updateTaskName(projectId: number, taskId: number, newName: string) {
      const p = this.projects.find(p => p.id === projectId)
      const t = p?.tasks.find(t => t.id === taskId)
      if (t) t.name = newName
    },
  }
})
