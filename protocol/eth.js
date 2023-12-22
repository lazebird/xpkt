function arr2hex(arr, wrap) {
  if (wrap === void 0) {
    wrap = 31;
  }
  var str = '';
  for (var i = 0; i < arr.length; i++) {
    if (i && (i & wrap) === 0) str += '\n';
    else if (i && (i & 7) === 0) str += '\t';
    str += arr[i].toString(16).padStart(2, '0') + ' ';
  }
  return str.trim();
}
function array2num(arr) {
  var val = 0;
  for (var i = 0; i < arr.length; i++) val = (val << 8) + arr[i];
  return val;
}
const array2mac = function (arr) {
  return arr2hex(arr).replaceAll(' ', ':');
};
function mac2arr(val) {
  var rawVal = '';
  if (val.match(/^[0-9a-f]{2}:[0-9a-f]{2}:[0-9a-f]{2}:[0-9a-f]{2}:[0-9a-f]{2}:[0-9a-f]{2}$/)) rawVal = val.replaceAll(':', '');
  if (val.match(/^[0-9a-f]{4}.[0-9a-f]{4}.[0-9a-f]{4}$/)) rawVal = val.replaceAll('.', '');
  if (val.match(/^[0-9A-F]{2}-[0-9A-F]{2}-[0-9A-F]{2}-[0-9A-F]{2}-[0-9A-F]{2}-[0-9A-F]{2}$/)) rawVal = val.replaceAll('-', '');
  if (val.match(/^[0-9a-f]{12}$/)) rawVal = val;
  if (!rawVal) return null;
  var fmt = Array(6).fill('');
  return fmt.map(function (_, i) {
    var _a;
    return parseInt((_a = rawVal === null || rawVal === void 0 ? void 0 : rawVal.slice(i * 2, i * 2 + 2)) !== null && _a !== void 0 ? _a : '0', 16);
  });
}
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
function num_change(arr, pos, val, len) {
  var nums = num2arr(Number(val), len);
  var j = 0;
  for (var i = pos[0]; i <= pos[1]; i++) arr[i] = nums[j++];
  return arr;
}
function mac_change(arr, pos, val) {
  var nums = mac2arr(val);
  if (!nums) return arr;
  var j = 0;
  for (var i = pos[0]; i <= pos[1]; i++) arr[i] = nums[j++];
  return arr;
}
const num2hex = function (n) {
  return '0x' + n.toString(16);
};

var initval = [0x00, 0x0e, 0xc6, 0xc1, 0x38, 0x41, 0x74, 0xa9, 0x12, 0x12, 0x03, 0x12, 0x08, 0x00];
function decode(arr, start) {
  var config = {
    key: 'eth',
    pos: [start, start + 13],
    children: [
      {
        key: 'dmac',
        value: array2mac(arr.slice(start, start + 6)),
        type: 'mac',
        pos: [start, start + 5],
        change: function (arr, e) {
          return mac_change(arr, e.pos, e.value);
        },
      },
      {
        key: 'smac',
        value: array2mac(arr.slice(start + 6, start + 12)),
        type: 'mac',
        pos: [start + 6, start + 11],
        change: function (arr, e) {
          return mac_change(arr, e.pos, e.value);
        },
      },
      {
        key: 'etype',
        value: num2hex(array2num(arr.slice(start + 12, start + 14))),
        type: 'hex',
        pos: [start + 12, start + 13],
        change: function (arr, e) {
          return num_change(arr, e.pos, e.value, 2);
        },
      },
    ],
  };
  return config;
}

export default { name: 'eth', parents: 'none', initval: initval, decode: decode };
