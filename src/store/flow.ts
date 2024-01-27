import { computed, ref } from 'vue';
import { defineStore } from 'pinia';
import { store } from './index';
import { FlowConf, FlowItem } from '#/flow';
import { sflow_buf2 } from '@/api/data';
import { getUserConf, setUserConf } from '@/api/conf';

const initFlow: FlowItem = { name: 'test', pkt: sflow_buf2, muts: [], tx: { count: 1 } };
const newFlow: FlowItem = { name: '', pkt: [], muts: [], tx: { count: 1 } };

export const useFlowStore = defineStore('flow', () => {
  const conf = ref({} as FlowConf);
  async function init() {
    try {
      const pkt = JSON.parse(getUserConf('pkt'));
      conf.value.flows = [{ ...initFlow, pkt: pkt ?? initFlow.pkt }];
    } catch (e) {
      console.log('read error: %o, use default config', e);
      conf.value.flows = [initFlow];
    }
    flow_edit(conf.value.flows.length - 1); // auto use the last flow for edit, for test
  }
  const flows = computed(() => conf.value.flows);
  const flows_set = (val: Array<FlowItem>) => {
    conf.value.flows = val;
    save();
  };
  const editFlow = ref(JSON.parse(JSON.stringify(newFlow)));
  const flow_edit = (i: number) => (editFlow.value = JSON.parse(JSON.stringify(flows.value[i] ? flows.value[i] : newFlow)));

  const editPkt = computed(() => editFlow.value.pkt);
  const pkt_pos = ref([0, 0]);
  const pkt_mode = ref('pkt');
  const pkt_update = (val: Array<number>) => (editFlow.value.pkt = val);
  const pkt_select = (npos: Array<number>) => (pkt_pos.value = npos);
  const pkt_set_mode = (val: string) => (pkt_mode.value = val);

  const selected_keys = computed(() => conf.value.selected_keys);
  const keys_select = (keys: Array<number>) => {
    conf.value.selected_keys = keys;
    save();
  };

  const load = () => undefined;
  const save = async () => setUserConf(JSON.stringify(editPkt.value), 'pkt');
  return { init, flows, flows_set, editFlow, flow_edit, editPkt, pkt_update, pkt_pos, pkt_select, pkt_mode, pkt_set_mode, selected_keys, keys_select, load, save };
});

export const useFlowStoreOut = () => useFlowStore(store);
