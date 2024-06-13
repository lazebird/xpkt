export function arr2hex(arr: Array<number>, wrap = 31) {
  let str = '';
  for (let i = 0; i < arr.length; i++) {
    if (i && (i & wrap) === 0) str += '\n';
    else if (i && (i & 7) === 0) str += '\t';
    str += arr[i].toString(16).padStart(2, '0') + ' ';
  }
  return str.trim();
}

export const array2num = (arr: Array<number>) => arr.reduce((acc, val) => (acc << 8) + val, 0);

export const array2mac = (arr: Array<number>) => arr2hex(arr).replaceAll(' ', ':');

export const array2ipv4 = (arr: Array<number>) => `${arr[0]}.${arr[1]}.${arr[2]}.${arr[3]}`;

export function hex2arr(val: string) {
  const nums = val.split(/\s+/).filter((e) => e.length);
  // console.log('val %s, nums %o', val, nums);
  for (const n of nums) if (n.length > 2) return null;
  return nums.map((e) => parseInt(e, 16));
}

export function mac2arr(val: string) {
  let rawVal = '';
  if (val.match(/^[0-9a-f]{2}:[0-9a-f]{2}:[0-9a-f]{2}:[0-9a-f]{2}:[0-9a-f]{2}:[0-9a-f]{2}$/)) rawVal = val.replaceAll(':', '');
  if (val.match(/^[0-9a-f]{4}.[0-9a-f]{4}.[0-9a-f]{4}$/)) rawVal = val.replaceAll('.', '');
  if (val.match(/^[0-9A-F]{2}-[0-9A-F]{2}-[0-9A-F]{2}-[0-9A-F]{2}-[0-9A-F]{2}-[0-9A-F]{2}$/)) rawVal = val.replaceAll('-', '');
  if (val.match(/^[0-9a-f]{12}$/)) rawVal = val;
  if (!rawVal) return null;
  const fmt = Array(6).fill('');
  return fmt.map((_, i) => parseInt(rawVal?.slice(i * 2, i * 2 + 2) ?? '0', 16));
}

export function ip2arr(val: string) {
  const matches = val.match(/^(\d+)\.(\d+)\.(\d+)\.(\d+)$/);
  // console.log(matches);
  if (!matches) return null;
  const digits = matches.slice(1, 5).map((d) => parseInt(d));
  for (const d of digits) if (d < 0 || d > 255) return null;
  return digits;
}

export function num2arr(val: number, len = 4) {
  const hex = val.toString(16).padStart(len << 1, '0');
  const arr = Array(len).fill(0);
  const res = arr.map((_, i) => parseInt(hex.slice(i << 1, (i + 1) << 1), 16));
  // console.log('val %s, hex %s, res %o', val.toString(16), hex, res);
  return res;
}

export function num_change(arr: Array<number>, pos: Array<number>, val: number, len: number) {
  const nums = num2arr(Number(val), len);
  let j = 0;
  for (let i = pos[0]; i <= pos[1]; i++) arr[i] = nums[j++];
  return arr;
}
export function mac_change(arr: Array<number>, pos: Array<number>, val: string) {
  const nums = mac2arr(val);
  if (!nums) return arr;
  let j = 0;
  for (let i = pos[0]; i <= pos[1]; i++) arr[i] = nums[j++];
  return arr;
}
export function ipv4_change(arr: Array<number>, pos: Array<number>, val: string) {
  const nums = ip2arr(val);
  if (!nums) return arr;
  let j = 0;
  for (let i = pos[0]; i <= pos[1]; i++) arr[i] = nums[j++];
  return arr;
}
export function hex_change(arr: Array<number>, pos: Array<number>, val: string) {
  const nums = hex2arr(val);
  if (!nums) return arr;
  let j = 0;
  for (let i = pos[0]; i <= pos[1]; i++) arr[i] = nums[j++];
  return arr;
}

export function checksum_calc(arr: Array<number>, len: number) {
  let sum = 0;
  for (let i = 0; i < len - 1; i += 2) sum += (arr[i] << 8) + arr[i + 1];
  if (len & 1) sum += arr[len - 1];
  sum = (sum >> 16) + (sum & 0xffff);
  const checksum = (~sum >>> 0) & 0xffff; // transfer to unsigned
  return checksum;
}
export function checksum_check(arr: Array<number>, len: number) {
  let sum = 0;
  for (let i = 0; i < len - 1; i += 2) sum += (arr[i] << 8) + arr[i + 1];
  if (len & 1) sum += arr[len - 1];
  sum = (sum >> 16) + (sum & 0xffff);
  // console.log('arr %s, len %d, sum %s', arr, len, sum.toString(16));
  return sum === 0xffff;
}

export const num2hex = (n: number) => '0x' + n.toString(16);

export function array2ipv6(arr: Array<number>) {
  if (arr.length != 16) return null;
  const newarr = [];
  for (let i = 0; i < 16; i += 2) newarr.push(((arr[i] << 8) + arr[i + 1]).toString(16));
  return newarr.join(':');
}
export function ipv6_change(arr: Array<number>, pos: Array<number>, val: string) {
  const nums = ip2arr(val);
  if (!nums) return arr;
  let j = 0;
  for (let i = pos[0]; i <= pos[1]; i++) arr[i] = nums[j++];
  return arr;
}
