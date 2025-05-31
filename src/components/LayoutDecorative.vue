<template>
  <div class="min-h-screen flex flex-col bg-base-200">
    <!-- Top bar -->
    <TopDecorative />

    <!-- Contenedor principal: sidebar + vista -->
    <div class="flex flex-1 overflow-hidden">
      <!-- Sidebar -->
      <div class="w-64 bg-base-300 p-4">
        <SideDecorative />
      </div>

      <!-- Vista principal -->
      <div class="flex-1 overflow-auto bg-base-100 p-6 relative">
        <!-- Contenido dinámico -->
        <slot />

        <!-- Botón flotante -->
        <button class="btn btn-accent btn-circle fixed bottom-6 right-6 shadow-lg z-50">
    <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
      <circle cx="12" cy="12" r="11.5" stroke="currentColor" stroke-width="1" />
      <path stroke-linecap="round" stroke-linejoin="round" d="M12 8v8m-4-4h8" />
    </svg>
  </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import TopDecorative from './TopDecorative.vue'
import SideDecorative from './SideDecorative.vue'
</script>
