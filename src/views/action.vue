<template>
  <div style="margin-right: 20px"> <a-button v-for="d in datas" class="btn" :icon="d.icon" :href="d.href" /> </div>
</template>
<script setup lang="ts">
  import { h } from 'vue';
  import { HomeOutlined, SettingOutlined, InfoCircleOutlined } from '@ant-design/icons-vue';
  const datas = [
    { name: 'home', icon: h(HomeOutlined), href: '#/' },
    // { name: 'setting', icon: h(SettingOutlined), href: '#/setting' },
    { name: 'about', icon: h(InfoCircleOutlined), href: '#/about' },
  ];
</script>
<style scoped>
  .btn {
    margin-left: 8px;
  }
</style>
