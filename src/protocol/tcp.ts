import { ProtocolConfig, ProtocolNode } from '#/protocol';
import { array2num, checksum_calc, checksum_check, num2arr, num2hex, num_change } from './share';

const initval = [0x00, 0x50, 0xc3, 0x2a, 0x03, 0x17, 0xe6, 0x54, 0x34, 0x85, 0x39, 0x56, 0x80, 0x10, 0x03, 0xea, 0xfa, 0x6e, 0x00, 0x00, 0x01, 0x01, 0x08, 0x0a, 0x05, 0x16, 0x28, 0x93, 0x78, 0xb8, 0xae, 0x74];

function decode(arr: Array<number>, start: number) {
  const config: ProtocolNode = {
    key: 'tcp',
    pos: [start, start + 31],
    children: [
      { key: 'sport', value: array2num(arr.slice(start, start + 2)), type: 'number', pos: [start, start + 1], change: (arr, e) => num_change(arr, e.pos, e.value, 2) },
      { key: 'dport', value: array2num(arr.slice(start + 2, start + 4)), type: 'number', pos: [start + 2, start + 3], change: (arr, e) => num_change(arr, e.pos, e.value, 2) },
      { key: 'seq', value: array2num(arr.slice(start + 4, start + 8)), type: 'number', pos: [start + 4, start + 7], change: (arr, e) => num_change(arr, e.pos, e.value, 4) },
      { key: 'ack', value: array2num(arr.slice(start + 8, start + 12)), type: 'number', pos: [start + 8, start + 11], change: (arr, e) => num_change(arr, e.pos, e.value, 4) },
      { key: 'header len', value: arr[start + 12], type: 'number', pos: [start + 12, start + 12], change: (arr, e) => num_change(arr, e.pos, e.value, 1) },
      {
        key: 'checksum',
        value: num2hex(array2num(arr.slice(start + 16, start + 18))),
        type: 'hex',
        pos: [start + 16, start + 17],
        change: (arr, e) => num_change(arr, e.pos, e.value, 2),
        check: (arr, e) => {
          if (start < 20) return false;
          const sip = arr.slice(start - 8, start - 4);
          const dip = arr.slice(start - 4, start);
          const tcp_len = num2arr(array2num(arr.slice(start - 18, start - 16)) - 20, 2);
          const fakehdr = [...sip, ...dip, 0, 6, ...tcp_len];
          const tcphdr = arr.slice(start, start + 32);
          const data = arr.slice(start + 32);
          const newarr = [...fakehdr, ...tcphdr, ...data];
          console.log('newarr %o, tcp_len %o', newarr, tcp_len);
          e.status = checksum_check(newarr, newarr.length) ? undefined : 'error';
        },
        calc: (arr, e) => {
          if (start < 20) return [];
          const sip = arr.slice(start - 8, start - 4);
          const dip = arr.slice(start - 4, start);
          const tcp_len = num2arr(array2num(arr.slice(start - 18, start - 16)) - 20, 2);
          const fakehdr = [...sip, ...dip, 0, 6, ...tcp_len];
          const tcphdr = [...arr.slice(start, start + 16), 0, 0, ...arr.slice(start + 18, start + 32)];
          const data = arr.slice(start + 32);
          const newarr = [...fakehdr, ...tcphdr, ...data];
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
