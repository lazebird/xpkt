import { ProtocolConfig, ProtocolNode } from '#/protocol';
import { array2num, checksum_calc, checksum_check, num2hex, num_change } from './share';

const initval = [
  0x08, 0x00, 0x4d, 0x59, 0x00, 0x01, 0x00, 0x02, 0x61, 0x62, 0x63, 0x64, 0x65, 0x66, 0x67, 0x68, 0x69, 0x6a, 0x6b, 0x6c, 0x6d, 0x6e, 0x6f, 0x70, 0x71, 0x72, 0x73, 0x74, 0x75, 0x76, 0x77, 0x61, 0x62, 0x63, 0x64, 0x65, 0x66, 0x67, 0x68, 0x69,
];
const typeOpts = [
  { label: 'Echo request', value: 1 },
  { label: 'Echo reply', value: 0 },
];

function decode(arr: Array<number>, start: number) {
  const config: ProtocolNode = {
    key: 'icmp',
    pos: [start, start + 7],
    children: [
      { key: 'type', value: arr[start], options: typeOpts, pos: [start, start], change: (arr, e) => num_change(arr, e.pos, e.value, 1) },
      { key: 'code', value: arr[start + 1], type: 'number', pos: [start + 1, start + 1], change: (arr, e) => num_change(arr, e.pos, e.value, 1) },
      {
        key: 'checksum',
        value: num2hex(array2num(arr.slice(start + 2, start + 4))),
        type: 'hex',
        pos: [start + 2, start + 3],
        change: (arr, e) => num_change(arr, e.pos, e.value, 2),
        check: (arr, e) => {
          if (start < 20) return false;
          const icmphdr = arr.slice(start, start + 8);
          const data = arr.slice(start + 8);
          const newarr = [...icmphdr, ...data];
          e.status = checksum_check(newarr, newarr.length) ? undefined : 'error';
        },
        calc: (arr, e) => {
          if (start < 20) return [];
          const icmphdr = [...arr.slice(start, start + 2), 0x0, 0x0];
          const data = arr.slice(start + 4);
          const newarr = [...icmphdr, ...data];
          e.value = num2hex(checksum_calc(newarr, newarr.length));
          e.status = undefined;
          return num_change(arr, e.pos, e.value, 2);
        },
      },
      { key: 'id', value: array2num(arr.slice(start + 4, start + 6)), type: 'number', pos: [start + 4, start + 5], change: (arr, e) => num_change(arr, e.pos, e.value, 2) },
      { key: 'seq', value: array2num(arr.slice(start + 6, start + 8)), type: 'number', pos: [start + 6, start + 7], change: (arr, e) => num_change(arr, e.pos, e.value, 2) },
    ],
  };
  return config;
}
export default { name: 'icmp', parents: [{ name: 'ipv4', pname: 'protocol', pval: 1 }], initval, decode, allow_payload: true } as ProtocolConfig;
