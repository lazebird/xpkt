<template>
  <a-row style="align-items: center; justify-content: center">
    <h2>Structure</h2>
    <a-tooltip title="update checksums"> <a-button class="btn" type="primary" @click.stop="onCalc" :icon="h(CalculatorOutlined)" /></a-tooltip>
    <a-tooltip title="undo changes"> <a-button class="btn" @click.stop="onUndo" :icon="h(UndoOutlined)" danger /></a-tooltip>
    <a-tooltip title="reload from hex"> <a-button class="btn" @click.stop="onReload" :icon="h(ReloadOutlined)" /></a-tooltip>
  </a-row>
  <a-collapse v-model:activeKey="activeKey" accordion>
    <a-collapse-panel v-for="(d, index) in data" :key="index" :header="d.key" @click="onClick(d)">
      <a-table :columns="columns" :data-source="d.children" size="small" :showHeader="false" :pagination="false">
        <template #bodyCell="{ column, text, record }">
          <template v-if="['value'].includes(column.dataIndex) && !record.children?.length">
            <a-auto-complete class="val" v-if="record.options?.length" v-model:value="record.value" :options="record.options" @click.stop="onClick(record)" @change="onChange(d, record)" />
            <a-input-number v-else-if="record.type === 'number'" v-model:value="record.value" :status="record.status" @click.stop="onClick(record)" @change="onChange(d, record)" />
            <a-row style="align-items: center; justify-content: flex-start" v-else-if="record.type === 'hex'">
              <a-input class="val" v-model:value="record.value" :status="record.status" @click.stop="onClick(record)" @change="onChange(d, record)" />
              <a-button v-if="record.check" class="btn" @click.stop="record.check(flowStore.editPkt, record)" :icon="h(CheckOutlined)" />
              <a-button v-if="record.update" class="btn" type="primary" @click.stop="record.update(flowStore.editPkt, record)" :icon="h(CalculatorOutlined)" />
            </a-row>
            <a-textarea v-else class="pkt" v-model:value="record.value" @click.stop="onClick(record)" @change="onChange(d, record)" autoSize />
          </template>
          <div v-else style="width: 100%" @click.stop="onClick(record)">{{ text }}</div>
        </template>
      </a-table>
      <template #extra> <a-button :icon="h(CloseOutlined)" danger @click="onClose(d)" /></template>
    </a-collapse-panel>
  </a-collapse>
  <br />
  <a-dropdown v-if="menus.length">
    <a class="ant-dropdown-link" @click.prevent> <PlusOutlined /> </a>
    <template #overlay>
      <a-menu @click="onAdd">
        <a-menu-item v-for="(m, index) in menus" :key="index">{{ m.name }} </a-menu-item>
      </a-menu>
    </template>
  </a-dropdown>
</template>
<script setup lang="ts">
  import { ref, h, watch } from 'vue';
  import { get_protos, pkt_decode } from '@/api/pkt';
  import { CalculatorOutlined, CheckOutlined, CloseOutlined, PlusOutlined, ReloadOutlined, UndoOutlined } from '@ant-design/icons-vue';
  import { ProtocolConfig, ProtocolItem } from '#/protocol';
  import { useFlowStore } from '@/store/flow';
  import { useProtoStore } from '@/store/protocol';
  import { message } from 'ant-design-vue';
  const protoStore = useProtoStore();

  const flowStore = useFlowStore();

  const activeKey = ref();
  const menus = ref([] as ProtocolItem[]);
  var oldData: Array<number>;
  const data = ref(data_update(flowStore.editPkt, true));

  const columns = [
    { title: 'Name', dataIndex: 'key' },
    { title: 'Value', dataIndex: 'value' },
  ];
  watch(
    () => flowStore.pkt_mode,
    () => {
      data.value = data_update(flowStore.editPkt);
      onCalc(); // always auto calc checksums after normal edit
    },
  );

  const onReload = () => (data.value = data_update(flowStore.editPkt, true));
  const onUndo = () => {
    data.value = data_update(oldData);
    flowStore.pkt_update(oldData);
    activeKey.value = data.value.length - 1;
  };
  const onClick = (e: ProtocolConfig) => flowStore.pkt_select(e.pos);
  const onClose = (e: ProtocolConfig) => {
    const index = data.value.findIndex((o) => o.key === e.key);
    if (index < 0) return;
    data.value = data.value.slice(0, index);
    // console.log('index %d, data %o', index, JSON.parse(JSON.stringify(data.value)));
    menus.value = menu_update(data.value);
    flowStore.pkt_update(e.pos[0] ? flowStore.editPkt.slice(0, e.pos[0]) : []);
    activeKey.value = data.value.length - 1;
  };
  function onAdd({ key }: { key: number }) {
    const buf = [...flowStore.editPkt, ...menus.value[key].initval];
    data.value = data_update(buf);
    flowStore.pkt_update(buf);
    activeKey.value = data.value.length - 1;
  }

  function onChange(hdr: ProtocolConfig, e: ProtocolConfig) {
    try {
      const buf = e.change?.(flowStore.editPkt, e);
      if (!buf) throw new Error(`change function of ${hdr.key} should return the pkt array`);
      flowStore.pkt_update(buf);
    } catch (error) {
      message.error(`Config '${e.key}' change error: ${error}`, 5);
      console.log('%s change error: %o', e.key, error);
    }
    menus.value = menu_update(data.value);
    if (!e.update) onCalc(); // update checksum automatically, not for checksum itself
  }
  function onCalc() {
    for (const s of data.value)
      for (const e of s.children ?? []) {
        try {
          e?.update?.(flowStore.editPkt, e);
        } catch (error) {
          message.error(`Config '${e.key}' update error: ${error}`, 5);
        }
      }
  }

  function data_update(data: Array<number>, record = false) {
    const arr = pkt_decode(data, protoStore.data);
    // console.log('data %o, protos %o, arr %o', data, protoStore.data, arr);
    if (!activeKey.value) activeKey.value = arr.length - 1;
    menus.value = menu_update(arr);
    if (record) oldData = [...data];
    flowStore.editFlow.structs = arr.map((a) => a.key);
    return arr;
  }
  function menu_update(data: Array<ProtocolConfig>) {
    return get_protos(data.at(-1), protoStore.data);
  }
</script>
<style scoped>
  .val {
    width: 200px;
  }
  .pkt {
    font-family: Consolas, Monaco, monospace;
    text-align: left;
  }
  .btn {
    margin-left: 5px;
  }
</style>
