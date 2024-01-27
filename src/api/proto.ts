import { ProtocolConfig, ProtocolItem } from '#/protocol';

const isStr = (v: any) => typeof v === 'string';
const isNum = (v: any) => typeof v === 'number';
const isArray = (v: any, echk: Function) => Array.isArray(v) && !v.filter((e) => !echk(e)).length;

const check_parent = (v: any) => isStr(v.name) && isStr(v.pname) && v.pval;
function check_parents(v: any) {
  if (typeof v === 'string') return v === 'all' || v === 'none';
  if (!isArray(v, check_parent)) throw new Error('parents invalid');
  return true;
}

const cfg_types = ['number', 'mac', 'ipv4', 'hex', 'pkt'];
const check_opt = (o: any) => typeof o.label === 'string' && o.value !== undefined;
function check_changefn(v: any, c: ProtocolConfig) {
  if (typeof v !== 'function') throw new Error('change fn invalid');
  const buf = new Array(100).fill(0xff);
  const res = v(buf, c);
  if (!isArray(res, isNum)) throw new Error('change fn ret invalid');
  return true;
}
function check_checkfn(v: any, c: ProtocolConfig) {
  if (typeof v !== 'function') throw new Error('check fn invalid');
  const buf = new Array(100).fill(0xff);
  v(buf, c);
  return true;
}
function check_updatefn(v: any, c: ProtocolConfig) {
  if (typeof v !== 'function') return false;
  const buf = new Array(100).fill(0xff);
  const res = v(buf, c);
  if (!isArray(res, isNum)) throw new Error('update fn invalid');
  return true;
}
function check_config(v: any) {
  if (!isStr(v.key)) throw new Error('config key invalid');
  if (!isArray(v.pos, isNum) || v.pos.length != 2) throw new Error('config pos invalid');
  if (v.children && !isArray(v.children, check_config)) throw new Error('config children invalid');
  if (v.type && !cfg_types.includes(v.type)) throw new Error('config type invalid');
  //   if (v.value && !isStr(v.value) && !isNum(v.value)) return false;
  if (v.options && !isArray(v.options, check_opt)) throw new Error('config options invalid');
  if (v.status && v.status !== 'error') throw new Error('config status invalid');
  if (v.change && !check_changefn(v.change, v)) throw new Error('config change fn invalid');
  if (v.check && !check_checkfn(v.check, v)) throw new Error('config check fn invalid');
  if (v.update && !check_updatefn(v.update, v)) throw new Error('config update fn invalid');

  if (v.value && !v.change) throw new Error('config change fn invalid');
  if (v.value && v.children) throw new Error('config children invalid');
  if (v.update && !v.check) throw new Error('config check fn invalid');
  if (v.check && !v.update) throw new Error('config update fn invalid');
  return true;
}
function check_decodefn(v: any) {
  if (typeof v !== 'function') throw new Error('decode fn invalid');
  const buf = new Array(100).fill(0xff);
  const res = v(buf, 0);
  if (!check_config(res)) throw new Error('decode config invalid');
  return true;
}

// throw all exceptions out
export function proto_validate(p: ProtocolItem) {
  if (!isStr(p.name)) throw new Error('protocol name invalid');
  if (p.priority !== undefined && !isNum(p.priority)) throw new Error('protocol priority invalid');
  if (!check_parents(p.parents)) throw new Error('protocol parents invalid');
  if (!isArray(p.initval, isNum)) throw new Error('protocol initval invalid');
  if (!check_decodefn(p.decode)) throw new Error('protocol decode invalid');
  return true;
}
