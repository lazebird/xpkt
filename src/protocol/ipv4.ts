import { ProtocolConfig, ProtocolNode } from '#/protocol';
import { array2ipv4, array2num, checksum_calc, checksum_check, ipv4_change, num2hex, num_change } from './share';

const initval = [0x45, 0x00, 0x00, 0xfc, 0xd4, 0x4d, 0x40, 0x00, 0x40, 0x11, 0x5c, 0xd7, 0x02, 0x02, 0x02, 0x5f, 0x02, 0x02, 0x02, 0x6a];
const protoOpts = [
  { label: 'icmp', value: 1 },
  { label: 'igmp', value: 2 },
  { label: 'tcp', value: 6 },
  { label: 'udp', value: 17 },
];
function decode(arr: Array<number>, start: number) {
  const config: ProtocolNode = {
    key: 'ipv4',
    pos: [start, start + 19],
    children: [
      { key: 'id', value: array2num(arr.slice(start + 4, start + 6)), type: 'number', pos: [start + 4, start + 5], change: (arr, e) => num_change(arr, e.pos, e.value, 2) },
      { key: 'ttl', value: arr[start + 8], type: 'number', pos: [start + 8, start + 8], change: (arr, e) => num_change(arr, e.pos, e.value, 1) },
      { key: 'protocol', value: arr[start + 9], options: protoOpts, pos: [start + 9, start + 9], change: (arr, e) => num_change(arr, e.pos, e.value, 1) },
      {
        key: 'checksum',
        value: num2hex(array2num(arr.slice(start + 10, start + 12))),
        type: 'hex',
        pos: [start + 10, start + 11],
        change: (arr, e) => num_change(arr, e.pos, e.value, 2),
        check: (arr, e) => (e.status = checksum_check(arr.slice(config.pos[0]), 20) ? undefined : 'error'),
        calc: (arr, e) => {
          const tmparr = arr.slice(config.pos[0], config.pos[1] + 1);
          tmparr[10] = tmparr[11] = 0; // set to 0 for checksum calc
          e.value = num2hex(checksum_calc(tmparr, 20));
          e.status = undefined;
          num_change(arr, e.pos, e.value, 2);
          return arr;
        },
      },
      { key: 'sip', value: array2ipv4(arr.slice(start + 12, start + 16)), type: 'ipv4', pos: [start + 12, start + 15], change: (arr, e) => ipv4_change(arr, e.pos, e.value) },
      { key: 'dip', value: array2ipv4(arr.slice(start + 16, start + 20)), type: 'ipv4', pos: [start + 16, start + 19], change: (arr, e) => ipv4_change(arr, e.pos, e.value) },
    ],
  };
  return config;
}
export default {
  name: 'ipv4',
  parents: [
    { name: 'eth', pname: 'etype', pval: 0x0800 },
    { name: 'dot1q', pname: 'etype', pval: 0x0800 },
  ],
  initval,
  decode,
  allow_payload: true,
} as ProtocolConfig;
