const userConfName = 'userconf';
export function getUserConf(key?: string) {
  const c = JSON.parse(localStorage.getItem(userConfName) ?? '{}');
  return key ? c[key] : c;
}

export function setUserConf(val: string, key?: string) {
  let c: any = JSON.parse(localStorage.getItem(userConfName) ?? '{}');
  if (key) c[key] = val;
  else c = JSON.parse(val);
  localStorage.setItem(userConfName, JSON.stringify(c));
}

const sysConfName = 'sysconf';
export function getSysConf(key?: string) {
  const c = JSON.parse(localStorage.getItem(sysConfName) ?? '{}');
  return key ? c[key] : c;
}

export function setSysConf(val: string, key?: string) {
  let c: any = JSON.parse(localStorage.getItem(sysConfName) ?? '{}');
  if (key) c[key] = val;
  else c = JSON.parse(val);
  localStorage.setItem(sysConfName, JSON.stringify(c));
}

const sysCapName = 'syscap';
export function getSysCap(key?: string) {
  const c = JSON.parse(localStorage.getItem(sysCapName) ?? '{}');
  return key ? c[key] : c;
}

export function setSysCap(val: string, key?: string) {
  let c: any = JSON.parse(localStorage.getItem(sysCapName) ?? '{}');
  if (key) c[key] = val;
  else c = JSON.parse(val);
  localStorage.setItem(sysCapName, JSON.stringify(c));
}

const ssConfName = 'ssconf';
export function getSsConf(key?: string) {
  const c = JSON.parse(sessionStorage.getItem(ssConfName) ?? '{}');
  return key ? c[key] : c;
}

export function setSsConf(val: string, key?: string) {
  let c: any = JSON.parse(sessionStorage.getItem(ssConfName) ?? '{}');
  if (key) c[key] = val;
  else c = JSON.parse(val);
  sessionStorage.setItem(ssConfName, JSON.stringify(c));
}
