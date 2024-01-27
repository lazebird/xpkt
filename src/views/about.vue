<template>
  <a-form :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }">
    <template v-for="d in data" :key="d.label">
      <a-form-item :label="d.label" style="text-align: left">
        <a v-if="d.link" :href="d.link" target="_blank">{{ d.value }}</a>
        <template v-else>{{ d.value }}</template>
      </a-form-item>
    </template>
  </a-form>
</template>
<script setup lang="ts">
  const { pkg, git, buildTime } = __APP_INFO__; /*global __APP_INFO__*/

  const { name, version, homepage, issuepage, releasepage } = pkg;
  document.title = name;
  const data = [
    { label: 'Name', value: name, link: homepage },
    { label: 'Version', value: `${version} (${git.branch} ${git.hash} ${git.date})`, link: releasepage },
    { label: 'Build Time', value: buildTime },
    { label: 'Issues', value: 'Github', link: issuepage },
  ];
</script>
