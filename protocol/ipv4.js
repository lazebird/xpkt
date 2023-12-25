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
  const initval = [0x45, 0x00, 0x00, 0xfc, 0xd4, 0x4d, 0x40, 0x00, 0x40, 0x11, 0x5c, 0xd7, 0x02, 0x02, 0x02, 0x5f, 0x02, 0x02, 0x02, 0x6a];
const protoOpts = [
    { label: 'icmp', value: 1 },
    { label: 'igmp', value: 2 },
    { label: 'tcp', value: 6 },
    { label: 'udp', value: 17 },
];
function decode(arr, start) {
    const config = {
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
                update: (arr, e) => {
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
};
