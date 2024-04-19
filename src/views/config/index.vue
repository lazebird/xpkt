<template>
  <div>
    <a-row>
      <a-col :span="12"> <tpl /> </a-col>
      <a-col :span="12"> <hex /> </a-col>
    </a-row>
  </div>
</template>
<script setup>
  import tpl from './tpl.vue';
  import hex from './hex.vue';
</script>
<style scoped>
  label {
    margin-left: 20px;
  }
</style>
