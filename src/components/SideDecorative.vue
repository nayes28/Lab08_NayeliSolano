<template>
  <div class="w-64 min-h-full">
    <!-- Encabezado -->
    <h2 class="text-lg font-bold mb-1">Proyectos</h2>
    <p class="text-sm text-gray-400 mb-4">No hay proyectos</p>

    <!-- Menú -->
    <ul class="menu bg-base-300 rounded-box w-full">
      <li><a>Item 1</a></li>

      <li>
        <details>
          <summary>Parent</summary>
          <ul>
            <li><a>Submenu 1</a></li>
            <li><a>Submenu 2</a></li>

            <li>
              <details>
                <summary>Parent</summary>
                <ul>
                  <li><a>Submenu 1</a></li>
                  <li><a>Submenu 2</a></li>
                </ul>
              </details>
            </li>
          </ul>
        </details>
      </li>

      <li><a>Item 3</a></li>
    </ul>
  </div>
</template>

<script setup lang="ts">
// Sin lógica JS, todo es HTML/CSS nativo con Daisy
</script>
