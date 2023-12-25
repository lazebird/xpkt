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
  
  
  
  
  const num2hex = (n) => '0x' + n.toString(16);
  const initval = [0x00, 0x0e, 0xc6, 0xc1, 0x38, 0x41, 0x74, 0xa9, 0x12, 0x12, 0x03, 0x12, 0x08, 0x00];
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
function decode(arr, start) {
    const config = {
        key: 'eth',
        pos: [start, start + 13],
        children: [
            { key: 'dmac', value: array2mac(arr.slice(start, start + 6)), type: 'mac', pos: [start, start + 5], change: (arr, e) => mac_change(arr, e.pos, e.value) },
            { key: 'smac', value: array2mac(arr.slice(start + 6, start + 12)), type: 'mac', pos: [start + 6, start + 11], change: (arr, e) => mac_change(arr, e.pos, e.value) },
            { key: 'etype', value: num2hex(array2num(arr.slice(start + 12, start + 14))), options: etypeOpts, pos: [start + 12, start + 13], change: (arr, e) => num_change(arr, e.pos, e.value, 2) },
        ],
    };
    return config;
}
export default { name: 'eth', parents: 'none', initval, decode };
