<template>
  <LayoutDecorative>
    <div class="p-6 flex-1 bg-base-200 relative">
      <!-- SIN PROYECTO SELECCIONADO -->
      <div v-if="!project">
        <h2 class="text-2xl font-semibold mb-4">Proyectos</h2>

        <table class="table w-full">
          <thead>
            <tr>
              <th>#</th>
              <th>Nombre</th>
              <th>Tareas</th>
              <th>Progreso</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(p, i) in projects"
              :key="p.id"
              class="hover cursor-pointer"
              @click="store.selectProject(p.id)"
            >
              <td>{{ i + 1 }}</td>
              <td>{{ p.name }}</td>
              <td>{{ p.tasks.length }}</td>
              <td>
                <progress
                  class="progress progress-success w-56"
                  :value="progressOf(p)"
                  max="100"
                ></progress>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- CON PROYECTO SELECCIONADO -->
      <div v-else>
        <div class="mb-4 flex justify-between items-center">
          <h2 class="text-2xl font-semibold">{{ project.name }}</h2>
          <button class="btn btn-sm" @click="store.selectProject(null as any)">← Volver</button>
        </div>

        <progress
          class="progress progress-success w-full mb-4"
          :value="progress"
          max="100"
        ></progress>

        <!-- Tabla de tareas -->
        <table class="table w-full">
          <thead>
            <tr>
              <th>#</th>
              <th>Tarea</th>
              <th>Estado</th>
              <th>Eliminar</th>
            </tr>
          </thead>
          <tbody>
            <!-- Tareas existentes -->
            <tr v-for="(t, index) in project.tasks" :key="t.id">
              <td>{{ index + 1 }}</td>
              <td :class="{ 'line-through text-gray-500': t.completed }">
                {{ t.name }}
              </td>
              <td>
                <input type="checkbox" :checked="t.completed" @change="toggleTask(project.id, t.id)" />
              </td>
              <td>
                <button class="btn btn-xs btn-error" @click="removeTask(project.id, t.id)">🗑</button>
              </td>
            </tr>

            <!-- Fila para nueva tarea -->
            <tr>
              <td>{{ project.tasks.length + 1 }}</td>
              <td colspan="3">
                <input
                  v-model="newTask"
                  type="text"
                  placeholder="Escriba nueva tarea y presione Enter"
                  class="input input-bordered input-sm w-full"
                  @keydown.enter.prevent="addTask"
                />
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- BOTÓN FLOTANTE PARA NUEVO PROYECTO -->
      <FloatingButton
        :buttonClass="'btn btn-accent btn-circle fixed bottom-6 right-6 shadow-lg z-50'"
        @click="modalRef?.open()"
      />

      <!-- MODAL PARA CREAR PROYECTO -->
      <ProjectModal ref="modalRef">
        <template #title>
          <h3 class="text-lg font-bold">Nuevo Proyecto</h3>
        </template>

        <template #default>
          <input
            v-model="newProjectName"
            type="text"
            placeholder="Nombre del proyecto"
            class="input input-bordered w-full"
          />
        </template>

        <template #footer>
          <button class="btn" @click="modalRef?.close()">Cancelar</button>
          <button class="btn btn-primary" @click="saveProject">Guardar</button>
        </template>
      </ProjectModal>
    </div>
  </LayoutDecorative>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import LayoutDecorative from '@/components/LayoutDecorative.vue'
import FloatingButton from '@/components/FloatingButton.vue'
import ProjectModal from '@/components/ProjectModal.vue'
import { useProjectsStore } from '@/stores/projects'

const store = useProjectsStore()
const project = computed(() => store.selectedProject)
const progress = computed(() => store.projectProgress)
const projects = store.projects

const newTask = ref('')
const newProjectName = ref('')
const modalRef = ref<InstanceType<typeof ProjectModal> | null>(null)

function addTask() {
  if (project.value && newTask.value.trim()) {
    store.addTask(project.value.id, newTask.value.trim())
    newTask.value = ''
  }
}

function toggleTask(pid: number, tid: number) {
  store.toggleTask(pid, tid)
}

function removeTask(pid: number, tid: number) {
  store.removeTask(pid, tid)
}

function saveProject() {
  if (newProjectName.value.trim()) {
    store.addProject(newProjectName.value.trim())
    newProjectName.value = ''
    modalRef.value?.close()
  }
}

function progressOf(p: typeof store.projects[0]) {
  if (!p.tasks.length) return 0
  const done = p.tasks.filter((t) => t.completed).length
  return Math.round((done / p.tasks.length) * 100)
}
</script>
