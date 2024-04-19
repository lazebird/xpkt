<template>
  <a-row style="align-items: center; justify-content: center">
    <h2>Hex</h2>
    <a-tooltip v-if="flowStore.pkt_mode === 'hex'" title="finish hex edit"> <a-button class="btn" @click.stop="onApply" :icon="h(CheckOutlined)" /></a-tooltip>
    <a-tooltip v-else title="enter hex edit mode"> <a-button class="btn" @click.stop="onEdit" :icon="h(EditOutlined)" /></a-tooltip>
    <a-tooltip title="save pkt to browser"> <a-button class="btn" @click.stop="onSave" :icon="h(SaveOutlined)" type="primary" /></a-tooltip>
  </a-row>
  <div style="display: flex">
    <pre class="pkt" v-if="flowStore.pkt_mode !== 'hex'">{{ viewData[0] }}<span class="select">{{ viewData[1] }}</span>{{ viewData[2] }}</pre>
    <a-textarea class="pkt" v-if="flowStore.pkt_mode === 'hex'" v-model:value="editData" :auto-size="{ minRows: 2 }" />
  </div>
</template>
<script setup lang="ts">
  import { h, computed, ref } from 'vue';
  import { arr2hex, hex2arr } from '@/api/share';
  import { useFlowStore } from '@/store/flow';
  import { EditOutlined, CheckOutlined, SaveOutlined } from '@ant-design/icons-vue';
  import { message } from 'ant-design-vue';

  const flowStore = useFlowStore();
  const viewData = computed(() => {
    const hex = arr2hex(flowStore.editPkt, 15);
    if (!flowStore.pkt_pos) return [hex, [''], ['']];
    const hex_start = flowStore.pkt_pos[0] * 3 + flowStore.pkt_pos[0] / 8;
    const hex_end = (flowStore.pkt_pos[1] + 1) * 3 + flowStore.pkt_pos[1] / 8;
    return [hex.slice(0, hex_start), hex.slice(hex_start, hex_end - 1), hex.slice(hex_end - 1)];
  });
  const editData = ref();
  function onApply() {
    const arr = hex2arr(editData.value);
    if (!arr?.length) return message.error('Format error, use spaces in every two digits, example: xx xx xx xx', 5);
    flowStore.pkt_update(arr);
    flowStore.pkt_set_mode('pkt');
    message.info('Checksums will be updated automatically', 5);
  }
  function onEdit() {
    editData.value = arr2hex(flowStore.editPkt, 15);
    flowStore.pkt_set_mode('hex');
  }
  const onSave = () => flowStore.save();
</script>
<style scoped>
  .btn {
    margin-left: 5px;
  }
  .pkt {
    font-family: Consolas, Monaco, monospace;
    text-align: left;
    margin: auto;
  }
  .select {
    background-color: blue;
    color: white;
  }
</style>
