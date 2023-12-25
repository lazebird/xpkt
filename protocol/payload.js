function arr2hex(arr, wrap = 31) {
    let str = '';
    for (let i = 0; i < arr.length; i++) {
      if (i && (i & wrap) === 0) str += '\n';
      else if (i && (i & 7) === 0) str += '\t';
      str += arr[i].toString(16).padStart(2, '0') + ' ';
    }
    return str.trim();
  }
  
  
  
  function hex2arr(val) {
    const nums = val.split(/\s+/).filter((e) => e.length);
    // console.log('val %s, nums %o', val, nums);
    for (const n of nums) if (n.length > 2) return null;
    return nums.map((e) => parseInt(e, 16));
  }
  
  
  
  
  
  
  
  
  
  
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
