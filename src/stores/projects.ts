// src/stores/projects.ts
import { defineStore } from 'pinia'

let pid = 1
let tid = 1

export const useProjectsStore = defineStore('projects', {
  state: () => ({
    projects: [] as {
      id: number
      name: string
      tasks: { id: number; name: string; completed: boolean }[]
    }[],
    selectedId: null as number | null,
  }),

  getters: {
    selectedProject(state) {
      return state.projects.find((p) => p.id === state.selectedId) || null
    },
    projectProgress(state): number {
      const p = state.projects.find((p) => p.id === state.selectedId)
      if (!p || !p.tasks.length) return 0
      const done = p.tasks.filter((t) => t.completed).length
      return Math.round((done / p.tasks.length) * 100)
    },
  },

  actions: {
    // Crear un nuevo proyecto
    addProject(name: string) {
      this.projects.push({
        id: pid++,
        name,
        tasks: [],
      })
    },

    // Seleccionar proyecto activo
    selectProject(id: number) {
      this.selectedId = id
    },

    // Agregar tarea al proyecto actual
    addTask(pid: number, name: string) {
      const project = this.projects.find((p) => p.id === pid)
      if (project) {
        project.tasks.push({
          id: tid++,
          name,
          completed: false,
        })
      }
    },

    toggleTask(pid: number, tid: number) {
      const project = this.projects.find((p) => p.id === pid)
      const task = project?.tasks.find((t) => t.id === tid)
      if (task) task.completed = !task.completed
    },

    removeTask(pid: number, tid: number) {
      const project = this.projects.find((p) => p.id === pid)
      if (project) {
        project.tasks = project.tasks.filter((t) => t.id !== tid)
      }
    },

    renameTask(pid: number, tid: number, newName: string) {
      const project = this.projects.find((p) => p.id === pid)
      const task = project?.tasks.find((t) => t.id === tid)
      if (task) task.name = newName
    },

    renameProject(pid: number, newName: string) {
      const project = this.projects.find((p) => p.id === pid)
      if (project) project.name = newName
    },

    removeProject(pid: number) {
      this.projects = this.projects.filter((p) => p.id !== pid)
      if (this.selectedId === pid) {
        this.selectedId = null
      }
    },
  },
})
