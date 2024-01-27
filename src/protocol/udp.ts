import { ProtocolConfig } from '#/protocol';
import { array2num, checksum_calc, checksum_check, num2hex, num_change } from './share';

const initval = [0xa8, 0xfa, 0x18, 0xc7, 0x00, 0xe8, 0x17, 0x67];
const dportOpts = [
  { label: 'dhcp-server', value: 67 },
  { label: 'dhcp-client', value: 68 },
  { label: 'tftp', value: 69 },
  { label: 'snmp', value: 161 },
  { label: 'snmptrap', value: 162 },
  { label: 'radius', value: 1812 },
  { label: 'radius-acct', value: 1813 },
  { label: 'sflow', value: 6343 },
];

function decode(arr: Array<number>, start: number) {
  const config: ProtocolConfig = {
    key: 'udp',
    pos: [start, start + 7],
    children: [
      { key: 'sport', value: array2num(arr.slice(start, start + 2)), type: 'number', pos: [start, start + 1], change: (arr, e) => num_change(arr, e.pos, e.value, 2) },
      { key: 'dport', value: array2num(arr.slice(start + 2, start + 4)), options: dportOpts, pos: [start + 2, start + 3], change: (arr, e) => num_change(arr, e.pos, e.value, 2) },
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
        update: (arr, e) => {
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
export default { name: 'udp', parents: [{ name: 'ipv4', pname: 'protocol', pval: 17 }], initval, decode };
