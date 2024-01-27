<template>
  <a-menu class="menu" v-model:selectedKeys="current" mode="horizontal" theme="dark">
    <a-menu-item v-for="e in routes.filter((r) => !r.redirect && !r.meta?.hide)" :key="e.path">
      <template #icon v-if="e.meta?.icon"><img class="icon" :src="e.meta.icon as string" /></template>
      <RouterLink :to="e.path || 'unknown'">{{ e.name }}</RouterLink>
    </a-menu-item>
  </a-menu>
</template>
j<script lang="ts" setup>
  import { ref, watchEffect } from 'vue';
  import { useRouter } from 'vue-router';
  import { routes } from '../router';

  const router = useRouter();
  const current = ref(['/flow']);
  watchEffect(() => (current.value = [router.currentRoute.value.path]));
</script>
<style scoped>
  .menu {
    background-color: inherit;
    color: white;
  }
  .icon {
    height: 24px;
    color: white;
  }
</style>
