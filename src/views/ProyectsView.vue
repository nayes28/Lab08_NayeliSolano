<template>
  <LayoutDecorative>
    <div class="p-6 relative">
      <!-- Tabla -->
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

      <!-- Botón flotante con ubicación controlada aquí -->
      <FloatingButton
        :buttonClass="'btn btn-accent btn-circle fixed bottom-10 right-10 shadow-lg z-50'"
        @click="openModal"
      />

      <!-- Modal de DaisyUI -->
      <dialog id="project_modal" class="modal">
        <div class="modal-box">
          <h3 class="text-lg font-bold">Nuevo Proyecto</h3>
          <form method="dialog" class="space-y-3 mt-4">
            <input type="text" placeholder="Nombre del proyecto" class="input input-bordered w-full" />
            <input type="number" placeholder="Tareas" class="input input-bordered w-full" />
            <input type="text" placeholder="Avance (%)" class="input input-bordered w-full" />

            <div class="modal-action">
              <button class="btn">Cancelar</button>
              <button class="btn btn-primary">Guardar</button>
            </div>
          </form>
        </div>
      </dialog>
    </div>
  </LayoutDecorative>
</template>

<script setup lang="ts">
import LayoutDecorative from '@/components/LayoutDecorative.vue'
import FloatingButton from '@/components/FloatingButton.vue'
import { ref } from 'vue'

const projects = ref([
  { id: 1, name: 'Proyecto A', tasks: 10, progress: '50%' },
  { id: 2, name: 'Proyecto B', tasks: 5, progress: '80%' }
])

function openModal() {
  const modal = document.getElementById('project_modal') as HTMLDialogElement
  if (modal) modal.showModal()
}
</script>
