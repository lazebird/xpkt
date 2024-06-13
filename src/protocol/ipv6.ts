import { ProtocolConfig, ProtocolNode } from '#/protocol';
import { array2ipv6, array2num, ipv6_change, num_change } from './share';

const initval = [
  0x60, 0x00, 0x00, 0x00, 0x00, 0x34, 0x11, 0x01, 0xfe, 0x80, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x76, 0xa9, 0x12, 0xff, 0xfe, 0x12, 0x03, 0x12, 0xff, 0x02, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x01, 0x00, 0x02,
];
const protoOpts = [
  { label: 'tcp', value: 6 },
  { label: 'udp', value: 17 },
  { label: 'icmpv6', value: 58 },
];
function decode(arr: Array<number>, start: number) {
  const config: ProtocolNode = {
    key: 'ipv6',
    pos: [start, start + 39],
    children: [
      { key: 'payload length', value: array2num(arr.slice(start + 4, start + 6)), type: 'number', pos: [start + 4, start + 5], change: (arr, e) => num_change(arr, e.pos, e.value, 2) },
      { key: 'next header', value: arr[start + 6], options: protoOpts, pos: [start + 6, start + 6], change: (arr, e) => num_change(arr, e.pos, e.value, 1) },
      { key: 'hop limit', value: arr[start + 7], pos: [start + 7, start + 7], change: (arr, e) => num_change(arr, e.pos, e.value, 1) },
      { key: 'sip', value: array2ipv6(arr.slice(start + 8, start + 24)), type: 'ipv6', pos: [start + 8, start + 23], change: (arr, e) => ipv6_change(arr, e.pos, e.value) },
      { key: 'dip', value: array2ipv6(arr.slice(start + 24, start + 40)), type: 'ipv6', pos: [start + 24, start + 39], change: (arr, e) => ipv6_change(arr, e.pos, e.value) },
    ],
  };
  return config;
}
export default {
  name: 'ipv6',
  parents: [
    { name: 'eth', pname: 'etype', pval: 0x86dd },
    { name: 'dot1q', pname: 'etype', pval: 0x86dd },
  ],
  initval,
  decode,
  allow_payload: true,
} as ProtocolConfig;
