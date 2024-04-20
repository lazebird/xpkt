import { ProtocolConfig, ProtocolNode } from '#/protocol';
import { array2num, checksum_calc, checksum_check, num2hex, num_change } from './share';

const initval = [0x1d, 0xc7, 0x01, 0xbb, 0x22, 0x70, 0xf3, 0xfa, 0xc1, 0xa1, 0x2c, 0x3c, 0x50, 0x10, 0x20, 0x00, 0x5c, 0x4d, 0x00, 0x00];

function decode(arr: Array<number>, start: number) {
  const config: ProtocolNode = {
    key: 'tcp',
    pos: [start, start + 19],
    children: [
      { key: 'sport', value: array2num(arr.slice(start, start + 2)), type: 'number', pos: [start, start + 1], change: (arr, e) => num_change(arr, e.pos, e.value, 2) },
      { key: 'dport', value: array2num(arr.slice(start + 2, start + 4)), type: 'number', pos: [start + 2, start + 3], change: (arr, e) => num_change(arr, e.pos, e.value, 2) },
      { key: 'seq', value: array2num(arr.slice(start + 4, start + 8)), type: 'number', pos: [start + 4, start + 7], change: (arr, e) => num_change(arr, e.pos, e.value, 4) },
      { key: 'ack', value: array2num(arr.slice(start + 8, start + 12)), type: 'number', pos: [start + 8, start + 11], change: (arr, e) => num_change(arr, e.pos, e.value, 4) },
      { key: 'header len', value: arr[start + 12], type: 'number', pos: [start + 12, start + 12], change: (arr, e) => num_change(arr, e.pos, e.value, 1) },
      {
        key: 'checksum',
        value: num2hex(array2num(arr.slice(start + 6, start + 8))),
        type: 'hex',
        pos: [start + 6, start + 7],
        change: (arr, e) => num_change(arr, e.pos, e.value, 2),
        check: (arr, e) => {
          if (start < 20) return false;
          const iphdr = arr.slice(start - 20, start);
          const fakehdr = [...iphdr.slice(12, 20), 0x0, iphdr[9], ...arr.slice(start + 4, start + 6)];
          const udphdr = arr.slice(start, start + 8);
          const data = arr.slice(start + 8);
          const newarr = [...fakehdr, ...udphdr, ...data];
          e.status = checksum_check(newarr, newarr.length) ? undefined : 'error';
        },
        calc: (arr, e) => {
          if (start < 20) return [];
          const iphdr = arr.slice(start - 20, start);
          const fakehdr = [...iphdr.slice(12, 20), 0x0, iphdr[9], ...arr.slice(start + 4, start + 6)];
          const udphdr = [...arr.slice(start, start + 6), 0x0, 0x0];
          const data = arr.slice(start + 8);
          const newarr = [...fakehdr, ...udphdr, ...data];
          e.value = num2hex(checksum_calc(newarr, newarr.length));
          e.status = undefined;
          return num_change(arr, e.pos, e.value, 2);
        },
      },
    ],
  };
  return config;
}
export default { name: 'tcp', parents: [{ name: 'ipv4', pname: 'protocol', pval: 6 }], initval, decode, allow_payload: true } as ProtocolConfig;
