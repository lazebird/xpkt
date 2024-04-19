import { ref } from 'vue';
import { defineStore } from 'pinia';
import { store } from './index';
import protos from '@/protocol';
import { message } from 'ant-design-vue';
import { proto_validate } from '@/api/proto';
import { ProtocolConfig, ProtocolParentConfig } from '#/protocol';

export const useProtoStore = defineStore('protocol', () => {
  const data = ref(protos as Array<ProtocolConfig>);
  const payload_parents = [] as String[];

  function add_proto(p: ProtocolConfig, notify = true) {
    if (data.value.find((d) => d.name === p.name)) return notify && message.error(`Protocol '${p.name}' dropped by name confliction`, 5);
    try {
      if (!proto_validate(p)) return notify && message.error(`Protocol '${p.name}' dropped by validation`, 5);
      data.value.push(p);
      if (p.allow_payload && !payload_parents.includes(p.name)) payload_parents.push(p.name); // avoid duplicate
    } catch (e) {
      notify && message.error(`Protocol '${p.name}' dropped by validation, error: ${e}`, 5);
      console.log('%s error: %o', p.name, e);
    }
  }
  const add_default = () => {
    protos.forEach((p) => add_proto(p, false));
    const payload = data.value.find((p) => p.name === 'payload');
    if (payload) payload.parents = payload_parents.map((n) => ({ name: n } as ProtocolParentConfig));
  };
  async function init() {
    data.value = [];
    add_default();
  }

  return { data, init };
});

export const useProtoStoreOut = () => useProtoStore(store);
