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

      <!-- Vista principal (slot dinámico) -->
      <div class="flex-1 overflow-auto bg-base-100 p-6 relative">
        <slot />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import TopDecorative from './TopDecorative.vue'
import SideDecorative from './SideDecorative.vue'
</script>
