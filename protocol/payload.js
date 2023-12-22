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
function hex2arr(val) {
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
var newArr = function (len) {
  return Array(len)
    .fill(1)
    .map(function () {
      return Math.floor(Math.random() * 256);
    });
};
var initval = newArr(64);
function len_change(arr, e, config) {
  var len = Number(e.value);
  var newarr = newArr(len);
  var oldlen = config.pos[1] - config.pos[0] + 1;
  for (var i = 0; i < oldlen; i++) arr.pop(); // remove old payload data
  arr.push.apply(
    // remove old payload data
    arr,
    newarr,
  );
  config.pos[1] = arr.length - 1;
  if (config.children) config.children[1].value = arr2hex(newarr);
  console.log('old len %d, new len %d, config %o', oldlen, newarr.length, config);
  return arr;
}
function data_change(arr, e, config) {
  var newarr = hex2arr(e.value);
  if (!newarr) return arr;
  var oldlen = config.pos[1] - config.pos[0] + 1;
  // console.log('old len %d, new len %d, arr %o', oldlen, newarr.length, arr);
  for (var i = 0; i < oldlen; i++) arr.pop(); // remove old payload data
  arr.push.apply(
    // remove old payload data
    arr,
    newarr,
  );
  config.pos[1] = arr.length - 1;
  if (config.children) config.children[0].value = newarr.length;
  return arr;
}
function decode(arr, start) {
  var config = {
    key: 'payload',
    pos: [start, arr.length - 1],
    children: [
      {
        key: 'len',
        value: arr.length - start,
        type: 'number',
        pos: [start, arr.length - 1],
        change: function (arr, e) {
          return len_change(arr, e, config);
        },
      },
      {
        key: 'hex',
        value: arr2hex(arr.slice(start), 15),
        type: 'pkt',
        pos: [start, arr.length - 1],
        change: function (arr, e) {
          return data_change(arr, e, config);
        },
      },
    ],
  };
  return config;
}
export default { name: 'payload', parents: 'all', priority: 255, initval: initval, decode: decode };
