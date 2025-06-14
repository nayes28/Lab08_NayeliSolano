<template>
  <LayoutDecorative>
    <div class="p-6 relative">
      <!-- Tabla de proyectos -->
      <div class="overflow-x-auto">
        <table class="table w-full">
          <thead>
            <tr>
              <th>#</th>
              <th>Proyecto</th>
              <th>Tareas</th>
              <th>Avance</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(project, index) in projects" :key="project.id">
              <th>{{ index + 1 }}</th>
              <td>{{ project.name }}</td>
              <td>{{ project.tasks }}</td>
              <td>{{ project.progress }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Botón flotante que abre el modal -->
      <FloatingButton
        :buttonClass="'btn btn-accent btn-circle fixed bottom-6 right-6 shadow-lg z-50'"
        @click="modalRef?.open()"
      />

      <!-- Modal reutilizable con slots -->
      <ProjectModal ref="modalRef">
        <template #title>
          <h3 class="text-lg font-bold">Nuevo Proyecto</h3>
        </template>

        <template #default>
          <input v-model="nuevo.nombre" type="text" placeholder="Nombre del proyecto" class="input input-bordered w-full mb-3" />
          <input v-model="nuevo.tareas" type="number" placeholder="Tareas" class="input input-bordered w-full mb-3" />
          <input v-model="nuevo.avance" type="text" placeholder="Avance (%)" class="input input-bordered w-full" />
        </template>

        <template #footer>
          <form method="dialog" class="flex gap-2">
            <button class="btn">Cancelar</button>
            <button class="btn btn-primary" @click.prevent="guardarProyecto">Guardar</button>
          </form>
        </template>
      </ProjectModal>
    </div>
  </LayoutDecorative>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import LayoutDecorative from '@/components/LayoutDecorative.vue'
import FloatingButton from '@/components/FloatingButton.vue'
import ProjectModal from '@/components/ProjectModal.vue'

const modalRef = ref<InstanceType<typeof ProjectModal> | null>(null)

const projects = ref([
  { id: 1, name: 'Proyecto A', tasks: 10, progress: '50%' },
  { id: 2, name: 'Proyecto B', tasks: 5, progress: '80%' }
])

const nuevo = ref({
  nombre: '',
  tareas: 0,
  avance: ''
})

function guardarProyecto() {
  projects.value.push({
    id: projects.value.length + 1,
    name: nuevo.value.nombre,
    tasks: nuevo.value.tareas,
    progress: nuevo.value.avance
  })

  // limpiar campos
  nuevo.value = { nombre: '', tareas: 0, avance: '' }
}
</script>
