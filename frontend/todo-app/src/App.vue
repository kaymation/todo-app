<template>
  <v-app>
    <v-main class="light-bg">
      <TodoList />
    </v-main>
  </v-app>
</template>

<script setup>
  import TodoList from '@/components/TodoList.vue'
</script>

<style scoped>
  .light-bg {
    background-color: #6699CC;
  }
</style>