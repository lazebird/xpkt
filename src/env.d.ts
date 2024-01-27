/// <reference types="vite/client" />

declare module '*.vue' {
  import { DefineComponent } from 'vue';
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types
  const component: DefineComponent<{}, {}, any>;
  export default component;
}
interface AppInfoPkg {
  name: string;
  version: string;
  homepage: string;
  issuepage: string;
  releasepage: string;
}
interface AppInfoGit {
  hash: string;
  branch: string;
  date: string;
}
interface AppInfo {
  pkg: AppInfoPkg;
  git: AppInfoGit;
  buildTime: string;
}
declare const __APP_INFO__: AppInfo;
