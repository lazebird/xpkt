import { ref } from 'vue';
import { defineStore } from 'pinia';
import { store } from './index';
import protos from '@/protocol';
import { message } from 'ant-design-vue';
import { proto_validate } from '@/api/proto';
import { ProtocolItem } from '#/protocol';

export const useProtoStore = defineStore('protocol', () => {
  const data = ref(protos as Array<ProtocolItem>);

  function add_proto(p: ProtocolItem, notify = true) {
    if (data.value.find((d) => d.name === p.name)) return notify && message.error(`Protocol '${p.name}' dropped by name confliction`, 5);
    try {
      if (!proto_validate(p)) return notify && message.error(`Protocol '${p.name}' dropped by validation`, 5);
      data.value.push(p);
    } catch (e) {
      notify && message.error(`Protocol '${p.name}' dropped by validation, error: ${e}`, 5);
      console.log('%s error: %o', p.name, e);
    }
  }
  const add_default = () => protos.forEach((p) => add_proto(p, false));
  async function init() {
    data.value = [];
    add_default();
  }

  return { data, init };
});

export const useProtoStoreOut = () => useProtoStore(store);
