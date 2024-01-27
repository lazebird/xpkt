import { ref } from 'vue';
import { defineStore } from 'pinia';
import { store } from './index';
import { AppConf } from '#/tauri';

const initConf: AppConf = { stat_interval: 3 };

export const useConfigStore = defineStore('config', () => {
  const conf = ref();
  async function init() {
    const cfg: AppConf = initConf;
    conf.value = cfg;
  }
  async function update(c: AppConf) {
    conf.value = c;
  }

  return { conf, init, update };
});

export const useConfigStoreOut = () => useConfigStore(store);
