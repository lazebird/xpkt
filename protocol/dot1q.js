
const array2num = (arr) => arr.reduce((acc, val) => (acc << 8) + val, 0);



function num2arr(val, len = 4) {
  const hex = val.toString(16).padStart(len << 1, '0');
  const arr = Array(len).fill(0);
  const res = arr.map((_, i) => parseInt(hex.slice(i << 1, (i + 1) << 1), 16));
  // console.log('val %s, hex %s, res %o', val.toString(16), hex, res);
  return res;
}
function num_change(arr, pos, val, len) {
  const nums = num2arr(Number(val), len);
  let j = 0;
  for (let i = pos[0]; i <= pos[1]; i++) arr[i] = nums[j++];
  return arr;
}
const num2hex = (n) => '0x' + n.toString(16);

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
function priority_change(arr, pos, val) {
  const priority = Number(val);
  const vlan = ((arr[pos[0]] & 0xf) << 8) + arr[pos[0] + 1];
  [arr[pos[0]], arr[pos[0] + 1]] = [(priority << 5) + (vlan >> 8), vlan & 0xff];
  return arr;
}
function vlan_change(arr, pos, val) {
  const priority = arr[pos[0]] >> 5;
  const vlan = Number(val);
  [arr[pos[0]], arr[pos[0] + 1]] = [(priority << 5) + (vlan >> 8), vlan & 0xff];
  return arr;
}
function decode(arr, start) {
  const config = {
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
