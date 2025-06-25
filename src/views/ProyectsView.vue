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
              <!-- inline-edit sin propagar click -->
              <td @click.stop>
                <span
                  v-if="editingProjectId !== p.id"
                  @dblclick.stop="startEditProject(p)"
                >{{ p.name }}</span>
                <input
                  v-else
                  ref="el => inputs.projectInput = el"
                  v-model="editedName"
                  @keydown.enter.prevent="finishEditProject(p)"
                  @blur="finishEditProject(p)"
                  class="input input-sm w-full"
                />
              </td>
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
          <!-- Nombre editable del proyecto abierto -->
          <div @click.stop class="flex items-center gap-2">
            <span
              v-if="editingProjectId !== project.id"
              class="text-2xl font-semibold"
              @dblclick.stop="startEditProject(project)"
            >{{ project.name }}</span>
            <input
              v-else
              ref="el => inputs.projectInput = el"
              v-model="editedName"
              @keydown.enter.prevent="finishEditProject(project)"
              @blur="finishEditProject(project)"
              class="input input-sm w-56"
            />
          </div>

          <!-- Aquí agregamos el botón de eliminar -->
          <div class="flex gap-2">
       <button
  class="btn btn-xs btn-error"
  @click="removeProject(project.id)"
>🗑 Eliminar proyecto</button>
            <button
              class="btn btn-sm"
              @click="store.selectProject(null as any)"
            >← Volver</button>
          </div>
        </div>

        <progress
          class="progress progress-success w-full mb-4"
          :value="progress"
          max="100"
        ></progress>

        <!-- Tabla de tareas (idéntica a la tuya) -->
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
            <tr v-for="(t, index) in project.tasks" :key="t.id">
              <td>{{ index + 1 }}</td>
              <td :class="{ 'line-through text-gray-500': t.completed }" @click.stop>
                <span
                  v-if="editingTaskId !== t.id"
                  @dblclick.stop="startEditTask(t)"
                >{{ t.name }}</span>
                <input
                  v-else
                  ref="el => inputs.taskInput = el"
                  v-model="editedName"
                  @keydown.enter.prevent="finishEditTask(project.id, t)"
                  @blur="finishEditTask(project.id, t)"
                  class="input input-sm w-full"
                />
              </td>
              <td>
                <input
                  type="checkbox"
                  :checked="t.completed"
                  @change="toggleTask(project.id, t.id)"
                />
              </td>
              <td>
                <button
                  class="btn btn-xs btn-error"
                  @click="removeTask(project.id, t.id)"
                >🗑</button>
              </td>
            </tr>
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

      <!-- BOTÓN FLOTANTE Y MODAL de nuevo proyecto -->
      <FloatingButton
        :buttonClass="'btn btn-accent btn-circle fixed bottom-6 right-6 shadow-lg z-50'"
        @click="modalRef?.open()"
      />
      <ProjectModal ref="modalRef">
        <template #title><h3 class="text-lg font-bold">Nuevo Proyecto</h3></template>
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
import { ref, computed, nextTick } from 'vue'
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

// Estados para inline edit
const editingProjectId = ref<number | null>(null)
const editingTaskId    = ref<number | null>(null)
const editedName       = ref('')

// Refs para inputs
const inputs: Record<string, HTMLInputElement | null> = {
  projectInput: null,
  taskInput:    null,
}

// Enfocar input tras activarlo
function focusInput(refName: string) {
  nextTick(() => {
    const el = inputs[refName]
    el?.focus()
    el?.select()
  })
}

// Inline-edit proyecto
function startEditProject(p: typeof projects[0]) {
  editingProjectId.value = p.id
  editedName.value       = p.name
  focusInput('projectInput')
}
function finishEditProject(p: typeof projects[0]) {
  if (editedName.value.trim()) {
    store.updateProjectName(p.id, editedName.value.trim())
  }
  editingProjectId.value = null
}

// Inline-edit tarea
function startEditTask(t: { id: number; name: string }) {
  editingTaskId.value = t.id
  editedName.value    = t.name
  focusInput('taskInput')
}
function finishEditTask(pid: number, t: { id: number; name: string }) {
  if (editedName.value.trim()) {
    store.updateTaskName(pid, t.id, editedName.value.trim())
  }
  editingTaskId.value = null
}

// Añadir / toggle / eliminar tarea
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

function removeProject(id: number) {
  // 1) Elimina del store
  store.removeProject(id)
  // 2) Deselecciona para que salga de la vista detalle y vuelva a la lista
  store.selectProject(null)
  // 3) Limpia cualquier inline‐edit “colgado”
  editingProjectId.value = null
  editingTaskId.value    = null
  editedName.value       = ''
  newTask.value          = ''
}
// Guardar nuevo proyecto y calcular progreso
function saveProject() {
  if (newProjectName.value.trim()) {
    store.addProject(newProjectName.value.trim())
    newProjectName.value = ''
    modalRef.value?.close()
  }
}
function progressOf(p: typeof projects[0]) {
  if (!p.tasks.length) return 0
  const done = p.tasks.filter((t) => t.completed).length
  return Math.round((done / p.tasks.length) * 100)
}
</script>
