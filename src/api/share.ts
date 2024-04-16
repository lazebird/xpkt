export const memImport = (str: string) => import(/* @vite-ignore */ 'data:text/javascript;base64,' + btoa(str));

export const tauri_on = () => window?.__TAURI_IPC__;

export function arr2hex(arr: Array<number>, wrap = 31) {
  let str = '';
  for (let i = 0; i < arr.length; i++) {
    if (i && (i & wrap) === 0) str += '\n';
    else if (i && (i & 7) === 0) str += '\t';
    str += arr[i].toString(16).padStart(2, '0') + ' ';
  }
  return str.trim();
}

export function hex2arr(val: string) {
  if (!val.match(/^[\s\da-fA-F]+$/)) return null;
  const nums = val.split(/\s+/).filter((e) => e.length);
  // console.log('val %s, nums %o', val, nums);
  for (const n of nums) if (n.length > 2) return null;
  return nums.map((e) => parseInt(e, 16));
}
