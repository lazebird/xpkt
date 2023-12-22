function array2num(arr) {
  var val = 0;
  for (var i = 0; i < arr.length; i++) val = (val << 8) + arr[i];
  return val;
}
const array2ipv4 = function (arr) {
  return ''.concat(arr[0], '.').concat(arr[1], '.').concat(arr[2], '.').concat(arr[3]);
};
function ip2arr(val) {
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
function ipv4_change(arr, pos, val) {
  var nums = ip2arr(val);
  if (!nums) return arr;
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

var initval = [0x45, 0x00, 0x00, 0xfc, 0xd4, 0x4d, 0x40, 0x00, 0x40, 0x11, 0x5c, 0xd7, 0x02, 0x02, 0x02, 0x5f, 0x02, 0x02, 0x02, 0x6a];
function decode(arr, start) {
  var config = {
    key: 'ipv4',
    pos: [start, start + 19],
    children: [
      {
        key: 'id',
        value: array2num(arr.slice(start + 4, start + 6)),
        type: 'number',
        pos: [start + 4, start + 5],
        change: function (arr, e) {
          return num_change(arr, e.pos, e.value, 2);
        },
      },
      {
        key: 'ttl',
        value: arr[start + 8],
        type: 'number',
        pos: [start + 8, start + 8],
        change: function (arr, e) {
          return num_change(arr, e.pos, e.value, 1);
        },
      },
      {
        key: 'protocol',
        value: arr[start + 9],
        type: 'number',
        pos: [start + 9, start + 9],
        change: function (arr, e) {
          return num_change(arr, e.pos, e.value, 1);
        },
      },
      {
        key: 'checksum',
        value: num2hex(array2num(arr.slice(start + 10, start + 12))),
        type: 'hex',
        pos: [start + 10, start + 11],
        change: function (arr, e) {
          return num_change(arr, e.pos, e.value, 2);
        },
        check: function (arr, e) {
          return (e.status = checksum_check(arr.slice(config.pos[0]), 20) ? undefined : 'error');
        },
        update: function (arr, e) {
          var tmparr = arr.slice(config.pos[0], config.pos[1] + 1);
          tmparr[10] = tmparr[11] = 0; // set to 0 for checksum calc
          e.value = num2hex(checksum_calc(tmparr, 20));
          e.status = undefined;
          num_change(arr, e.pos, e.value, 2);
          return arr;
        },
      },
      {
        key: 'sip',
        value: array2ipv4(arr.slice(start + 12, start + 16)),
        type: 'ipv4',
        pos: [start + 12, start + 15],
        change: function (arr, e) {
          return ipv4_change(arr, e.pos, e.value);
        },
      },
      {
        key: 'dip',
        value: array2ipv4(arr.slice(start + 16, start + 20)),
        type: 'ipv4',
        pos: [start + 16, start + 19],
        change: function (arr, e) {
          return ipv4_change(arr, e.pos, e.value);
        },
      },
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
  initval: initval,
  decode: decode,
};
