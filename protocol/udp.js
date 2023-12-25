function arr2hex(arr, wrap = 31) {
  let str = '';
  for (let i = 0; i < arr.length; i++) {
    if (i && (i & wrap) === 0) str += '\n';
    else if (i && (i & 7) === 0) str += '\t';
    str += arr[i].toString(16).padStart(2, '0') + ' ';
  }
  return str.trim();
}
const array2num = (arr) => arr.reduce((acc, val) => (acc << 8) + val, 0);
const array2mac = (arr) => arr2hex(arr).replaceAll(' ', ':');
const array2ipv4 = (arr) => `${arr[0]}.${arr[1]}.${arr[2]}.${arr[3]}`;
function hex2arr(val) {
  const nums = val.split(/\s+/).filter((e) => e.length);
  // console.log('val %s, nums %o', val, nums);
  for (const n of nums) if (n.length > 2) return null;
  return nums.map((e) => parseInt(e, 16));
}
function mac2arr(val) {
  let rawVal = '';
  if (val.match(/^[0-9a-f]{2}:[0-9a-f]{2}:[0-9a-f]{2}:[0-9a-f]{2}:[0-9a-f]{2}:[0-9a-f]{2}$/)) rawVal = val.replaceAll(':', '');
  if (val.match(/^[0-9a-f]{4}.[0-9a-f]{4}.[0-9a-f]{4}$/)) rawVal = val.replaceAll('.', '');
  if (val.match(/^[0-9A-F]{2}-[0-9A-F]{2}-[0-9A-F]{2}-[0-9A-F]{2}-[0-9A-F]{2}-[0-9A-F]{2}$/)) rawVal = val.replaceAll('-', '');
  if (val.match(/^[0-9a-f]{12}$/)) rawVal = val;
  if (!rawVal) return null;
  const fmt = Array(6).fill('');
  return fmt.map((_, i) => parseInt(rawVal?.slice(i * 2, i * 2 + 2) ?? '0', 16));
}
function ip2arr(val) {
  const matches = val.match(/^(\d+)\.(\d+)\.(\d+)\.(\d+)$/);
  // console.log(matches);
  if (!matches) return null;
  const digits = matches.slice(1, 5).map((d) => parseInt(d));
  for (const d of digits) if (d < 0 || d > 255) return null;
  return digits;
}
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
function mac_change(arr, pos, val) {
  const nums = mac2arr(val);
  if (!nums) return arr;
  let j = 0;
  for (let i = pos[0]; i <= pos[1]; i++) arr[i] = nums[j++];
  return arr;
}
function ipv4_change(arr, pos, val) {
  const nums = ip2arr(val);
  if (!nums) return arr;
  let j = 0;
  for (let i = pos[0]; i <= pos[1]; i++) arr[i] = nums[j++];
  return arr;
}
function hex_change(arr, pos, val) {
  const nums = hex2arr(val);
  if (!nums) return arr;
  let j = 0;
  for (let i = pos[0]; i <= pos[1]; i++) arr[i] = nums[j++];
  return arr;
}
function checksum_calc(arr, len) {
  let sum = 0;
  for (let i = 0; i < len - 1; i += 2) sum += (arr[i] << 8) + arr[i + 1];
  if (len & 1) sum += arr[len - 1];
  sum = (sum >> 16) + (sum & 0xffff);
  const checksum = (~sum >>> 0) & 0xffff; // transfer to unsigned
  return checksum;
}
function checksum_check(arr, len) {
  let sum = 0;
  for (let i = 0; i < len - 1; i += 2) sum += (arr[i] << 8) + arr[i + 1];
  if (len & 1) sum += arr[len - 1];
  sum = (sum >> 16) + (sum & 0xffff);
  // console.log('arr %s, len %d, sum %s', arr, len, sum.toString(16));
  return sum === 0xffff;
}
const num2hex = (n) => '0x' + n.toString(16);
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
function decode(arr, start) {
  const config = {
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
