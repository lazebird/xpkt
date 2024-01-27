import { RouteRecordRaw, createRouter, createWebHashHistory } from 'vue-router';
import SummaryVue from '@/views/summary.vue';
import ConfigVue from '@/views/config/index.vue';
import ProtoVue from '@/views/proto.vue';
import settingVue from '@/views/setting.vue';
import aboutVue from '@/views/about.vue';
import { App } from 'vue';
import flowsvg from '@/assets/icons/flow.svg';
import configsvg from '@/assets/icons/config.svg';
import protosvg from '@/assets/icons/proto.svg';

export const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Root',
    redirect: '/config',
  },
  {
    path: '/config',
    name: 'Configure',
    component: ConfigVue,
    meta: { icon: configsvg },
  },
  {
    path: '/about',
    name: 'About',
    component: aboutVue,
    meta: { hide: true },
  },
];
const defRouterOpts = { history: createWebHashHistory(), strict: true, scrollBehavior: () => ({ left: 0, top: 0 }) };
const router = createRouter({ ...defRouterOpts, routes });

export function setupRouter(app: App<Element>) {
  app.use(router);
}
