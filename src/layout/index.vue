<template>
  <a-layout style="height: 100%">
    <a-layout-header class="header" style="padding: 0">
      <a-row>
        <a-col :span="12"> <menuVue /> </a-col>
        <a-col :span="12" class="action"> <actionVue /> </a-col>
      </a-row>
    </a-layout-header>
    <a-layout-content> <RouterView /> </a-layout-content>
  </a-layout>
</template>
<script lang="ts" setup>
  import actionVue from '@/views/action.vue';
  import menuVue from '@/views/menu.vue';
</script>
<style scoped>
  .action {
    width: 100%;
    display: flex;
    justify-content: flex-end;
  }
</style>
