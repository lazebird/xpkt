import { ProtocolConfig, ProtocolNode } from '#/protocol';
import { array2num, checksum_calc, checksum_check, num2hex, num_change } from './share';

const initval = [
  0x86, 0x00, 0x02, 0x76, 0x40, 0x00, 0x07, 0x08, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x01, 0x01, 0x00, 0x74, 0x9c, 0x8f, 0xf0, 0x0e, 0x05, 0x01, 0x00, 0x00, 0x00, 0x00, 0x05, 0xdc, 0x03, 0x04, 0x40, 0xc0, 0x00, 0x27, 0x8d, 0x00, 0x00,
  0x09, 0x3a, 0x80, 0x00, 0x00, 0x00, 0x00, 0x00, 0x0a, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
];
const typeOpts = [
  { label: 'Router Solicitation', value: 133 },
  { label: 'Router Advertisment', value: 134 },
];

function decode(arr: Array<number>, start: number) {
  const config: ProtocolNode = {
    key: 'icmpv6',
    pos: [start, arr.length - 1],
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
          if (start < 40) return false;
          const sip = arr.slice(start - 32, start - 16);
          const dip = arr.slice(start - 16, start);
          const payload_len = arr.slice(start - 36, start - 34);
          const next_header = arr.slice(start - 34, start - 33);
          const fakehdr = [...sip, ...dip, 0, 0, ...payload_len, 0, 0, 0, ...next_header];
          const icmphdr = arr.slice(start);
          const newarr = [...fakehdr, ...icmphdr];
          e.status = checksum_check(newarr, newarr.length) ? undefined : 'error';
        },
        calc: (arr, e) => {
          if (start < 40) return [];
          const sip = arr.slice(start - 32, start - 16);
          const dip = arr.slice(start - 16, start);
          const payload_len = arr.slice(start - 36, start - 34);
          const next_header = arr.slice(start - 34, start - 33);
          const fakehdr = [...sip, ...dip, 0, 0, ...payload_len, 0, 0, 0, ...next_header];
          const icmphdr = [...arr.slice(start, start + 2), 0, 0, ...arr.slice(start + 4)];
          const newarr = [...fakehdr, ...icmphdr];
          e.value = num2hex(checksum_calc(newarr, newarr.length));
          e.status = undefined;
          return num_change(arr, e.pos, e.value, 2);
        },
      },
      { key: 'cur hop limit', value: arr[start + 4], type: 'number', pos: [start + 4, start + 4], change: (arr, e) => num_change(arr, e.pos, e.value, 1) },
    ],
  };
  return config;
}
export default { name: 'icmpv6', parents: [{ name: 'ipv6', pname: 'next header', pval: 58 }], initval, decode, allow_payload: true } as ProtocolConfig;
