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
  const newArr = (len) => Array(len)
    .fill(1)
    .map(() => Math.floor(Math.random() * 256));
const initval = newArr(64);
function len_change(arr, e, config) {
    const len = Number(e.value);
    const newarr = newArr(len);
    const oldlen = config.pos[1] - config.pos[0] + 1;
    for (let i = 0; i < oldlen; i++)
        arr.pop(); // remove old payload data
    arr.push(...newarr);
    config.pos[1] = arr.length - 1;
    if (config.children)
        config.children[1].value = arr2hex(newarr);
    console.log('old len %d, new len %d, config %o', oldlen, newarr.length, config);
    return arr;
}
function data_change(arr, e, config) {
    const newarr = hex2arr(e.value);
    if (!newarr)
        return arr;
    const oldlen = config.pos[1] - config.pos[0] + 1;
    // console.log('old len %d, new len %d, arr %o', oldlen, newarr.length, arr);
    for (let i = 0; i < oldlen; i++)
        arr.pop(); // remove old payload data
    arr.push(...newarr);
    config.pos[1] = arr.length - 1;
    if (config.children)
        config.children[0].value = newarr.length;
    return arr;
}
function decode(arr, start) {
    const config = {
        key: 'payload',
        pos: [start, arr.length - 1],
        children: [
            { key: 'len', value: arr.length - start, type: 'number', pos: [start, arr.length - 1], change: (arr, e) => len_change(arr, e, config) },
            { key: 'hex', value: arr2hex(arr.slice(start), 15), type: 'pkt', pos: [start, arr.length - 1], change: (arr, e) => data_change(arr, e, config) },
        ],
    };
    return config;
}
export default { name: 'payload', parents: 'all', priority: 255, initval, decode };
