import { ProtocolConfig, ProtocolNode } from '#/protocol';
import { mac_change, array2mac, array2num, num_change, num2hex } from './share';

const initval = [0x00, 0x0e, 0xc6, 0xc1, 0x38, 0x41, 0x74, 0xa9, 0x12, 0x12, 0x03, 0x12, 0x08, 0x00];
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
function decode(arr: Array<number>, start: number) {
  const config: ProtocolNode = {
    key: 'eth',
    pos: [start, start + 13],
    children: [
      { key: 'dmac', value: array2mac(arr.slice(start, start + 6)), type: 'mac', pos: [start, start + 5], change: (arr, e) => mac_change(arr, e.pos, e.value) },
      { key: 'smac', value: array2mac(arr.slice(start + 6, start + 12)), type: 'mac', pos: [start + 6, start + 11], change: (arr, e) => mac_change(arr, e.pos, e.value) },
      { key: 'etype', value: num2hex(array2num(arr.slice(start + 12, start + 14))), options: etypeOpts, pos: [start + 12, start + 13], change: (arr, e) => num_change(arr, e.pos, e.value, 2) },
    ],
  };
  return config;
}
export default { name: 'eth', parents: null, initval, decode, allow_payload: true } as ProtocolConfig;
