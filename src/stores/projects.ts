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
    addProject(name: string) {
      this.projects.push({ id: pid++, name, tasks: [] })
    },
    selectProject(id: number) {
      this.selectedId = id
    },
    addTask(pid: number, name: string) {
      const p = this.projects.find((p) => p.id === pid)
      if (p) p.tasks.push({ id: tid++, name, completed: false })
    },
    toggleTask(pid: number, tid: number) {
      const p = this.projects.find((p) => p.id === pid)
      const t = p?.tasks.find((t) => t.id === tid)
      if (t) t.completed = !t.completed
    },
  },
})
