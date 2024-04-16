import { ProtocolConfig, ProtocolNode } from '#/protocol';
import { hex2arr, arr2hex } from './share';

const newArr = (len: number) =>
  Array(len)
    .fill(1)
    .map(() => Math.floor(Math.random() * 256));

const initval = newArr(64);

function len_change(arr: Array<number>, e: ProtocolNode, config: ProtocolNode) {
  const len = Number(e.value);
  const newarr = newArr(len);
  const oldlen = config.pos[1] - config.pos[0] + 1;
  for (let i = 0; i < oldlen; i++) arr.pop(); // remove old payload data
  arr.push(...newarr);
  config.pos[1] = arr.length - 1;
  if (config.children) config.children[1].value = arr2hex(newarr);
  console.log('old len %d, new len %d, config %o', oldlen, newarr.length, config);
  return arr;
}
function data_change(arr: Array<number>, e: ProtocolNode, config: ProtocolNode) {
  const newarr = hex2arr(e.value);
  if (!newarr) return arr;
  const oldlen = config.pos[1] - config.pos[0] + 1;
  // console.log('old len %d, new len %d, arr %o', oldlen, newarr.length, arr);
  for (let i = 0; i < oldlen; i++) arr.pop(); // remove old payload data
  arr.push(...newarr);
  config.pos[1] = arr.length - 1;
  if (config.children) config.children[0].value = newarr.length;
  return arr;
}
function decode(arr: Array<number>, start: number) {
  const config: ProtocolNode = {
    key: 'payload',
    pos: [start, arr.length - 1],
    children: [
      { key: 'len', value: arr.length - start, type: 'number', pos: [start, arr.length - 1], change: (arr, e) => len_change(arr, e, config) },
      { key: 'hex', value: arr2hex(arr.slice(start), 15), type: 'pkt', pos: [start, arr.length - 1], change: (arr, e) => data_change(arr, e, config) },
    ],
  };
  return config;
}
export default { name: 'payload', parents: [], priority: 255, initval, decode } as ProtocolConfig;
