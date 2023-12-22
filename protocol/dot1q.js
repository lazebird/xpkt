function num2arr(val, len) {
  if (len === void 0) {
    len = 4;
  }
  var hex = val.toString(16).padStart(len << 1, '0');
  var arr = Array(len).fill(0);
  var res = arr.map(function (_, i) {
    return parseInt(hex.slice(i << 1, (i + 1) << 1), 16);
  });
  // console.log('val %s, hex %s, res %o', val.toString(16), hex, res);
  return res;
}
const num2hex = function (n) {
  return '0x' + n.toString(16);
};

function array2num(arr) {
  var val = 0;
  for (var i = 0; i < arr.length; i++) val = (val << 8) + arr[i];
  return val;
}
function num_change(arr, pos, val, len) {
  var nums = num2arr(Number(val), len);
  var j = 0;
  for (var i = pos[0]; i <= pos[1]; i++) arr[i] = nums[j++];
  return arr;
}

var initval = [0x50, 0x02, 0x08, 0x00];
function priority_change(arr, pos, val) {
  var _a;
  var priority = Number(val);
  var vlan = ((arr[pos[0]] & 0xf) << 8) + arr[pos[0] + 1];
  (_a = [(priority << 5) + (vlan >> 8), vlan & 0xff]), (arr[pos[0]] = _a[0]), (arr[pos[0] + 1] = _a[1]);
  return arr;
}
function vlan_change(arr, pos, val) {
  var _a;
  var priority = arr[pos[0]] >> 5;
  var vlan = Number(val);
  (_a = [(priority << 5) + (vlan >> 8), vlan & 0xff]), (arr[pos[0]] = _a[0]), (arr[pos[0] + 1] = _a[1]);
  return arr;
}
function decode(arr, start) {
  var config = {
    key: 'dot1q',
    pos: [start, start + 3],
    children: [
      {
        key: 'priority',
        value: arr[start] >> 5,
        type: 'number',
        pos: [start, start + 1],
        change: function (arr, e) {
          return priority_change(arr, e.pos, e.value);
        },
      },
      {
        key: 'vlan',
        value: ((arr[start] & 0xf) << 8) + arr[start + 1],
        type: 'number',
        pos: [start, start + 1],
        change: function (arr, e) {
          return vlan_change(arr, e.pos, e.value);
        },
      },
      {
        key: 'etype',
        value: num2hex(array2num(arr.slice(start + 2, start + 4))),
        type: 'hex',
        pos: [start + 2, start + 3],
        change: function (arr, e) {
          return num_change(arr, e.pos, e.value, 2);
        },
      },
    ],
  };
  return config;
}
export default { name: 'dot1q', parents: [{ name: 'eth', pname: 'etype', pval: 0x8100 }], initval: initval, decode: decode };
