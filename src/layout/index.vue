<template>
  <a-layout style="height: 100%">
    <a-layout-header class="header" style="padding: 0">
      <a-row>
        <a-col :span="12">
          <a-menu class="menu" v-model:selectedKeys="current" mode="horizontal" theme="dark">
            <a-menu-item v-for="e in routes.filter((r) => !r.redirect && !r.meta?.hide)" :key="e.path">
              <template #icon v-if="e.meta?.icon"><img class="icon" :src="e.meta.icon as string" /></template>
              <RouterLink :to="e.path || 'unknown'">{{ e.name }}</RouterLink>
            </a-menu-item>
          </a-menu>
        </a-col>
        <a-col :span="12" class="action"> <actionVue /> </a-col>
      </a-row>
    </a-layout-header>
    <a-layout-content> <RouterView /> </a-layout-content>
  </a-layout>
</template>
<script lang="ts" setup>
  import { ref, watchEffect } from 'vue';
  import { useRouter } from 'vue-router';
  import { routes } from '../router';
  import actionVue from '@/views/action.vue';

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
  .action {
    width: 100%;
    display: flex;
    justify-content: flex-end;
  }
</style>
