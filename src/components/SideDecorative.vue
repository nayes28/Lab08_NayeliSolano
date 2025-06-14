<template>
  <aside class="w-64 min-h-screen bg-base-300 p-4">
    <h2 class="text-lg font-bold mb-2">Proyectos</h2>
    <ul class="menu bg-base-100 rounded-box w-full">
      <li v-for="p in projects" :key="p.id">
        <details
          :open="openList.includes(p.id)"
          @toggle="handleToggle(p.id, $event)"
        >
          <summary>{{ p.name }}</summary>
          <ul class="pl-4 mt-2 space-y-1">
            <li v-for="t in p.tasks" :key="t.id" class="flex items-center">
              <input
                type="checkbox"
                class="checkbox checkbox-sm mr-2"
                :checked="t.completed"
                @change.stop="toggleTask(p.id, t.id)"
              />
              <span :class="{ 'line-through text-gray-500': t.completed }">
                {{ t.name }}
              </span>
            </li>
          </ul>
        </details>
      </li>
    </ul>
  </aside>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useProjectsStore } from '@/stores/projects'

const store = useProjectsStore()
const projects = store.projects
const openList = ref<number[]>([])

function toggleTask(pid: number, tid: number) {
  store.toggleTask(pid, tid)
}

function handleToggle(id: number, event: Event) {
  const el = event.target as HTMLDetailsElement

  if (el.open) {

    if (!openList.value.includes(id)) {
      openList.value.push(id)
    }
    store.selectProject(id)
  } else {
    openList.value = openList.value.filter(x => x !== id)
    store.selectProject(null as any)
  }
}
</script>
