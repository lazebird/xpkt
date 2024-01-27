<template>
  <div>
    <a-row>
      <a-col :span="12"> <struct /> </a-col>
      <a-col :span="12"> <hex /> </a-col>
    </a-row>
  </div>
</template>
<script setup>
  import struct from './pkt_struct.vue';
  import hex from './pkt_hex.vue';
</script>
<style scoped>
  label {
    margin-left: 20px;
  }
</style>
