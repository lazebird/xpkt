import type { App } from 'vue';
import { createPinia } from 'pinia';
import { useFlowStoreOut } from './flow';
import { useProtoStoreOut } from './protocol';
import { useConfigStoreOut } from './config';

export const store = createPinia();
export async function setupStore(app: App<Element>) {
  app.use(store);
  await useConfigStoreOut().init();
  await useFlowStoreOut().init();
  await useProtoStoreOut().init(useConfigStoreOut().conf.protocol_dir);
}
