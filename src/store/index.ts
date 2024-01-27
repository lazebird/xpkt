import type { App } from 'vue';
import { createPinia } from 'pinia';
import { useFlowStoreOut } from './flow';
import { useProtoStoreOut } from './protocol';

export const store = createPinia();
export async function setupStore(app: App<Element>) {
  app.use(store);
  await useFlowStoreOut().init();
  await useProtoStoreOut().init();
}
