function array2num(arr) {
  var val = 0;
  for (var i = 0; i < arr.length; i++) val = (val << 8) + arr[i];
  return val;
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
function checksum_calc(arr, len) {
  var sum = 0;
  for (var i = 0; i < len - 1; i += 2) sum += (arr[i] << 8) + arr[i + 1];
  if (len & 1) sum += arr[len - 1];
  sum = (sum >> 16) + (sum & 0xffff);
  var checksum = (~sum >>> 0) & 0xffff; // transfer to unsigned
  return checksum;
}
function checksum_check(arr, len) {
  var sum = 0;
  for (var i = 0; i < len - 1; i += 2) sum += (arr[i] << 8) + arr[i + 1];
  if (len & 1) sum += arr[len - 1];
  sum = (sum >> 16) + (sum & 0xffff);
  // console.log('arr %s, len %d, sum %s', arr, len, sum.toString(16));
  return sum === 0xffff;
}
const num2hex = function (n) {
  return '0x' + n.toString(16);
};

var __spreadArray =
  (this && this.__spreadArray) ||
  function (to, from, pack) {
    if (pack || arguments.length === 2)
      for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
          if (!ar) ar = Array.prototype.slice.call(from, 0, i);
          ar[i] = from[i];
        }
      }
    return to.concat(ar || Array.prototype.slice.call(from));
  };
var initval = [0xa8, 0xfa, 0x18, 0xc7, 0x00, 0xe8, 0x17, 0x67];
function decode(arr, start) {
  var config = {
    key: 'udp',
    pos: [start, start + 7],
    children: [
      {
        key: 'sport',
        value: array2num(arr.slice(start, start + 2)),
        type: 'number',
        pos: [start, start + 1],
        change: function (arr, e) {
          return num_change(arr, e.pos, e.value, 2);
        },
      },
      {
        key: 'dport',
        value: array2num(arr.slice(start + 2, start + 4)),
        type: 'number',
        pos: [start + 2, start + 3],
        change: function (arr, e) {
          return num_change(arr, e.pos, e.value, 2);
        },
      },
      {
        key: 'checksum',
        value: num2hex(array2num(arr.slice(start + 6, start + 8))),
        type: 'hex',
        pos: [start + 6, start + 7],
        change: function (arr, e) {
          return num_change(arr, e.pos, e.value, 2);
        },
        check: function (arr, e) {
          if (start < 20) return false;
          var iphdr = arr.slice(start - 20, start);
          var fakehdr = __spreadArray(__spreadArray(__spreadArray([], iphdr.slice(12, 20), true), [0x0, iphdr[9]], false), arr.slice(start + 4, start + 6), true);
          var udphdr = arr.slice(start, start + 8);
          var data = arr.slice(start + 8);
          var newarr = __spreadArray(__spreadArray(__spreadArray([], fakehdr, true), udphdr, true), data, true);
          e.status = checksum_check(newarr, newarr.length) ? undefined : 'error';
        },
        update: function (arr, e) {
          if (start < 20) return [];
          var iphdr = arr.slice(start - 20, start);
          var fakehdr = __spreadArray(__spreadArray(__spreadArray([], iphdr.slice(12, 20), true), [0x0, iphdr[9]], false), arr.slice(start + 4, start + 6), true);
          var udphdr = __spreadArray(__spreadArray([], arr.slice(start, start + 6), true), [0x0, 0x0], false);
          var data = arr.slice(start + 8);
          var newarr = __spreadArray(__spreadArray(__spreadArray([], fakehdr, true), udphdr, true), data, true);
          e.value = num2hex(checksum_calc(newarr, newarr.length));
          e.status = undefined;
          return num_change(arr, e.pos, e.value, 2);
        },
      },
    ],
  };
  return config;
}
export default { name: 'udp', parents: [{ name: 'ipv4', pname: 'protocol', pval: 17 }], initval: initval, decode: decode };
