import { ProtocolConfig } from '#/protocol';
import { array2num, num2hex, num_change } from './share';

const initval = [0x50, 0x02, 0x08, 0x00];
const etypeOpts = [
  { label: 'ipv4', value: '0x0800' },
  { label: 'arp', value: '0x0806' },
  { label: 'wol', value: '0x0842' },
  { label: 'rarp', value: '0x8035' },
  { label: 'dot1q', value: '0x8100' },
  { label: 'ipv6', value: '0x86dd' },
  { label: 'fc', value: '0x8808' },
  { label: 'eapol', value: '0x888e' },
];
function priority_change(arr: Array<number>, pos: Array<number>, val: number) {
  const priority = Number(val);
  const vlan = ((arr[pos[0]] & 0xf) << 8) + arr[pos[0] + 1];
  [arr[pos[0]], arr[pos[0] + 1]] = [(priority << 5) + (vlan >> 8), vlan & 0xff];
  return arr;
}
function vlan_change(arr: Array<number>, pos: Array<number>, val: number) {
  const priority = arr[pos[0]] >> 5;
  const vlan = Number(val);
  [arr[pos[0]], arr[pos[0] + 1]] = [(priority << 5) + (vlan >> 8), vlan & 0xff];
  return arr;
}

function decode(arr: Array<number>, start: number) {
  const config: ProtocolConfig = {
    key: 'dot1q',
    pos: [start, start + 3],
    children: [
      { key: 'priority', value: arr[start] >> 5, type: 'number', pos: [start, start + 1], change: (arr, e) => priority_change(arr, e.pos, e.value) },
      { key: 'vlan', value: ((arr[start] & 0xf) << 8) + arr[start + 1], type: 'number', pos: [start, start + 1], change: (arr, e) => vlan_change(arr, e.pos, e.value) },
      { key: 'etype', value: num2hex(array2num(arr.slice(start + 2, start + 4))), options: etypeOpts, pos: [start + 2, start + 3], change: (arr, e) => num_change(arr, e.pos, e.value, 2) },
    ],
  };
  return config;
}
export default { name: 'dot1q', parents: [{ name: 'eth', pname: 'etype', pval: 0x8100 }], initval, decode };
