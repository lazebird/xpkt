import { ProtocolConfig, ProtocolNode } from '#/protocol';
import { array2ipv4, array2mac, array2num, ipv4_change, mac_change, num_change } from './share';

const initval = [0x00, 0x01, 0x08, 0x00, 0x06, 0x04, 0x00, 0x01, 0xd4, 0x60, 0x75, 0x40, 0x37, 0x66, 0xc0, 0xa8, 0x02, 0xb0, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0xc0, 0xa8, 0x02, 0x82];
// const hwtypeOpts = [{ label: 'Ethernet', value: 1 }];
// const protoOpts = [{ label: 'IPv4', value: 0x0800 }];
const opcodeOpts = [
  { label: 'request', value: 1 },
  { label: 'reply', value: 2 },
];
function decode(arr: Array<number>, start: number) {
  const config: ProtocolNode = {
    key: 'arp',
    pos: [start, start + 27],
    children: [
      // { key: 'hardware type', value: array2num(arr.slice(start, start + 2)), options: hwtypeOpts, pos: [start, start + 1], change: (arr, e) => num_change(arr, e.pos, e.value, 2) },
      // { key: 'protocol type', value: array2num(arr.slice(start + 2, start + 4)), options: protoOpts, pos: [start + 2, start + 3], change: (arr, e) => num_change(arr, e.pos, e.value, 2) },
      // { key: 'hardware size', value: arr[start + 4], type: 'number', pos: [start + 4, start + 4], change: (arr, e) => num_change(arr, e.pos, e.value, 1) },
      // { key: 'protocol size', value: arr[start + 5], type: 'number', pos: [start + 5, start + 5], change: (arr, e) => num_change(arr, e.pos, e.value, 1) },
      { key: 'opcode', value: array2num(arr.slice(start + 6, start + 8)), options: opcodeOpts, pos: [start + 6, start + 7], change: (arr, e) => num_change(arr, e.pos, e.value, 2) },
      { key: 'sender mac', value: array2mac(arr.slice(start + 8, start + 14)), type: 'mac', pos: [start + 8, start + 13], change: (arr, e) => mac_change(arr, e.pos, e.value) },
      { key: 'sender ip', value: array2ipv4(arr.slice(start + 14, start + 18)), type: 'ipv4', pos: [start + 14, start + 17], change: (arr, e) => ipv4_change(arr, e.pos, e.value) },
      { key: 'target mac', value: array2mac(arr.slice(start + 18, start + 24)), type: 'mac', pos: [start + 18, start + 23], change: (arr, e) => mac_change(arr, e.pos, e.value) },
      { key: 'target ip', value: array2ipv4(arr.slice(start + 24, start + 28)), type: 'ipv4', pos: [start + 24, start + 27], change: (arr, e) => ipv4_change(arr, e.pos, e.value) },
    ],
  };
  return config;
}
export default {
  name: 'arp',
  parents: [
    { name: 'eth', pname: 'etype', pval: 0x0806 },
    { name: 'dot1q', pname: 'etype', pval: 0x0806 },
  ],
  initval,
  decode,
} as ProtocolConfig;
