export function arr2hex(arr, wrap) {
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
export function array2num(arr) {
  var val = 0;
  for (var i = 0; i < arr.length; i++) val = (val << 8) + arr[i];
  return val;
}
export const array2mac = function (arr) {
  return arr2hex(arr).replaceAll(' ', ':');
};
export const array2ipv4 = function (arr) {
  return ''.concat(arr[0], '.').concat(arr[1], '.').concat(arr[2], '.').concat(arr[3]);
};
export function hex2arr(val) {
  var nums = val.split(/\s+/).filter(function (e) {
    return e.length;
  });
  // console.log('val %s, nums %o', val, nums);
  for (var _i = 0, nums_1 = nums; _i < nums_1.length; _i++) {
    var n = nums_1[_i];
    if (n.length > 2) return null;
  }
  return nums.map(function (e) {
    return parseInt(e, 16);
  });
}
export function mac2arr(val) {
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
export function ip2arr(val) {
  var matches = val.match(/^(\d+)\.(\d+)\.(\d+)\.(\d+)$/);
  // console.log(matches);
  if (!matches) return null;
  var digits = matches.slice(1, 5).map(function (d) {
    return parseInt(d);
  });
  for (var _i = 0, digits_1 = digits; _i < digits_1.length; _i++) {
    var d = digits_1[_i];
    if (d < 0 || d > 255) return null;
  }
  return digits;
}
export function num2arr(val, len) {
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
export function num_change(arr, pos, val, len) {
  var nums = num2arr(Number(val), len);
  var j = 0;
  for (var i = pos[0]; i <= pos[1]; i++) arr[i] = nums[j++];
  return arr;
}
export function mac_change(arr, pos, val) {
  var nums = mac2arr(val);
  if (!nums) return arr;
  var j = 0;
  for (var i = pos[0]; i <= pos[1]; i++) arr[i] = nums[j++];
  return arr;
}
export function ipv4_change(arr, pos, val) {
  var nums = ip2arr(val);
  if (!nums) return arr;
  var j = 0;
  for (var i = pos[0]; i <= pos[1]; i++) arr[i] = nums[j++];
  return arr;
}
export function hex_change(arr, pos, val) {
  var nums = hex2arr(val);
  if (!nums) return arr;
  var j = 0;
  for (var i = pos[0]; i <= pos[1]; i++) arr[i] = nums[j++];
  return arr;
}
export function checksum_calc(arr, len) {
  var sum = 0;
  for (var i = 0; i < len - 1; i += 2) sum += (arr[i] << 8) + arr[i + 1];
  if (len & 1) sum += arr[len - 1];
  sum = (sum >> 16) + (sum & 0xffff);
  var checksum = (~sum >>> 0) & 0xffff; // transfer to unsigned
  return checksum;
}
export function checksum_check(arr, len) {
  var sum = 0;
  for (var i = 0; i < len - 1; i += 2) sum += (arr[i] << 8) + arr[i + 1];
  if (len & 1) sum += arr[len - 1];
  sum = (sum >> 16) + (sum & 0xffff);
  // console.log('arr %s, len %d, sum %s', arr, len, sum.toString(16));
  return sum === 0xffff;
}
export const num2hex = function (n) {
  return '0x' + n.toString(16);
};
