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
const array2ipv4 = function (arr) {
  return ''.concat(arr[0], '.').concat(arr[1], '.').concat(arr[2], '.').concat(arr[3]);
};
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
function hex_change(arr, pos, val) {
  var nums = hex2arr(val);
  if (!nums) return arr;
  var j = 0;
  for (var i = pos[0]; i <= pos[1]; i++) arr[i] = nums[j++];
  return arr;
}
const num2hex = function (n) {
  return '0x' + n.toString(16);
};
var initval = [
  0x00, 0x00, 0x00, 0x05, 0x00, 0x00, 0x00, 0x01, 0x02, 0x02, 0x02, 0x5f, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x24, 0x6d, 0x00, 0x03, 0x05, 0x70, 0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x03, 0x00, 0x00, 0x00, 0xbc, 0x00, 0x00, 0xfc, 0xea, 0x00,
  0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x03, 0x00, 0x00, 0x04, 0x00, 0x03, 0xf0, 0x14, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x03, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x03, 0x00, 0x00,
  0x00, 0x02, 0x00, 0x00, 0x00, 0x18, 0x00, 0x00, 0x00, 0xd9, 0x74, 0x56, 0x3c, 0x23, 0x31, 0x27, 0x00, 0x00, 0x01, 0x00, 0x5e, 0x7f, 0xff, 0xfa, 0x00, 0x00, 0x00, 0x00, 0x08, 0x00, 0x00, 0x00, 0x03, 0xe9, 0x00, 0x00, 0x00, 0x10, 0x00, 0x00, 0x00,
  0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x50, 0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0xd9, 0x00, 0x00, 0x00, 0x99, 0x00, 0x00, 0x00, 0x40, 0x01, 0x00, 0x5e, 0x7f,
  0xff, 0xfa, 0x74, 0x56, 0x3c, 0x23, 0x31, 0x27, 0x08, 0x00, 0x45, 0x00, 0x00, 0xcb, 0x94, 0x00, 0x00, 0x00, 0x01, 0x11, 0x73, 0x14, 0xc0, 0xa8, 0x01, 0x6b, 0xef, 0xff, 0xff, 0xfa, 0xe3, 0xbf, 0x07, 0x6c, 0x00, 0xb7, 0xd8, 0xad, 0x4d, 0x2d, 0x53,
  0x45, 0x41, 0x52, 0x43, 0x48, 0x20, 0x2a, 0x20, 0x48, 0x54, 0x54, 0x50, 0x2f, 0x31, 0x2e, 0x31, 0x0d, 0x0a, 0x48,
];
function sflow_ethdata_decode(arr, start) {
  var ethdata = {
    key: 'ethernet frame data',
    pos: [start - 8, start + array2num(arr.slice(start - 4, start)) - 1],
    value: '',
    children: [
      {
        key: 'pkt len',
        value: array2num(arr.slice(start, start + 4)),
        type: 'number',
        pos: [start, start + 3],
        change: function (arr, e) {
          return num_change(arr, e.pos, e.value, 4);
        },
      },
      {
        key: 'src mac',
        value: array2mac(arr.slice(start + 4, start + 10)),
        type: 'mac',
        pos: [start + 4, start + 9],
        change: function (arr, e) {
          return mac_change(arr, e.pos, e.value);
        },
      },
      {
        key: 'dst mac',
        value: array2mac(arr.slice(start + 12, start + 18)),
        type: 'mac',
        pos: [start + 12, start + 17],
        change: function (arr, e) {
          return mac_change(arr, e.pos, e.value);
        },
      },
      {
        key: 'etype',
        value: num2hex(array2num(arr.slice(start + 20, start + 24))),
        type: 'hex',
        pos: [start + 20, start + 23],
        change: function (arr, e) {
          return num_change(arr, e.pos, e.value, 4);
        },
      },
    ],
  };
  return ethdata;
}
function sflow_extswdata_decode(arr, start) {
  var extswdata = {
    key: 'extended switch data',
    pos: [start - 8, start + array2num(arr.slice(start - 4, start)) - 1],
    value: '',
    children: [
      {
        key: 'rx tag',
        value: array2num(arr.slice(start, start + 4)),
        type: 'number',
        pos: [start, start + 3],
        change: function (arr, e) {
          return num_change(arr, e.pos, e.value, 4);
        },
      },
      {
        key: 'rx priority',
        value: array2num(arr.slice(start + 4, start + 8)),
        type: 'number',
        pos: [start + 4, start + 7],
        change: function (arr, e) {
          return num_change(arr, e.pos, e.value, 4);
        },
      },
      {
        key: 'tx tag',
        value: array2num(arr.slice(start + 8, start + 12)),
        type: 'number',
        pos: [start + 8, start + 11],
        change: function (arr, e) {
          return num_change(arr, e.pos, e.value, 4);
        },
      },
      {
        key: 'tx priority',
        value: array2num(arr.slice(start + 12, start + 16)),
        type: 'number',
        pos: [start + 12, start + 15],
        change: function (arr, e) {
          return num_change(arr, e.pos, e.value, 4);
        },
      },
    ],
  };
  return extswdata;
}
function sflow_rawpkthdr_decode(arr, start) {
  var sample_len = array2num(arr.slice(start + 12, start + 16));
  var rawpkthdr = {
    key: 'raw packet header',
    pos: [start - 8, start + array2num(arr.slice(start - 4, start)) - 1],
    value: '',
    children: [
      {
        key: 'protocol',
        value: array2num(arr.slice(start, start + 4)),
        type: 'number',
        pos: [start, start + 3],
        change: function (arr, e) {
          return num_change(arr, e.pos, e.value, 4);
        },
      },
      {
        key: 'frame length',
        value: array2num(arr.slice(start + 4, start + 8)),
        type: 'number',
        pos: [start + 4, start + 7],
        change: function (arr, e) {
          return num_change(arr, e.pos, e.value, 4);
        },
      },
      {
        key: 'payload stripped',
        value: array2num(arr.slice(start + 8, start + 12)),
        type: 'number',
        pos: [start + 8, start + 11],
        change: function (arr, e) {
          return num_change(arr, e.pos, e.value, 4);
        },
      },
      {
        key: 'sample header length',
        value: sample_len,
        type: 'number',
        pos: [start + 12, start + 15],
        change: function (arr, e) {
          return num_change(arr, e.pos, e.value, 4);
        },
      },
      {
        key: 'sampled packet header',
        value: arr2hex(arr.slice(start + 16, start + 16 + sample_len)),
        type: 'pkt',
        pos: [start + 16, start + 16 + sample_len - 1],
        change: function (arr, e) {
          return hex_change(arr, e.pos, e.value);
        },
      },
    ],
  };
  return rawpkthdr;
}
function sflow_flow_decode(arr, start) {
  var _a, _b, _c;
  var end = start + array2num(arr.slice(start - 4, start)) - 1;
  var flow = {
    key: 'flow',
    pos: [start - 8, end],
    value: '',
    children: [
      {
        key: 'seq',
        value: array2num(arr.slice(start, start + 4)),
        type: 'number',
        pos: [start, start + 3],
        change: function (arr, e) {
          return num_change(arr, e.pos, e.value, 4);
        },
      },
      {
        key: 'src id type',
        value: array2num(arr.slice(start + 4, start + 8)),
        type: 'number',
        pos: [start + 4, start + 7],
        change: function (arr, e) {
          return num_change(arr, e.pos, e.value, 4);
        },
      },
      {
        key: 'src id index',
        value: array2num(arr.slice(start + 8, start + 12)),
        type: 'number',
        pos: [start + 8, start + 11],
        change: function (arr, e) {
          return num_change(arr, e.pos, e.value, 4);
        },
      },
      {
        key: 'rate',
        value: array2num(arr.slice(start + 12, start + 16)),
        type: 'number',
        pos: [start + 12, start + 15],
        change: function (arr, e) {
          return num_change(arr, e.pos, e.value, 4);
        },
      },
      {
        key: 'pool',
        value: array2num(arr.slice(start + 16, start + 20)),
        type: 'number',
        pos: [start + 16, start + 19],
        change: function (arr, e) {
          return num_change(arr, e.pos, e.value, 4);
        },
      },
      {
        key: 'dropped',
        value: array2num(arr.slice(start + 20, start + 24)),
        type: 'number',
        pos: [start + 20, start + 23],
        change: function (arr, e) {
          return num_change(arr, e.pos, e.value, 4);
        },
      },
      {
        key: 'input if fmt',
        value: array2num(arr.slice(start + 24, start + 28)),
        type: 'number',
        pos: [start + 24, start + 27],
        change: function (arr, e) {
          return num_change(arr, e.pos, e.value, 4);
        },
      },
      {
        key: 'input if val',
        value: array2num(arr.slice(start + 28, start + 32)),
        type: 'number',
        pos: [start + 28, start + 31],
        change: function (arr, e) {
          return num_change(arr, e.pos, e.value, 4);
        },
      },
      {
        key: 'output if fmt',
        value: array2num(arr.slice(start + 32, start + 36)),
        type: 'number',
        pos: [start + 32, start + 35],
        change: function (arr, e) {
          return num_change(arr, e.pos, e.value, 4);
        },
      },
      {
        key: 'output if val',
        value: array2num(arr.slice(start + 36, start + 40)),
        type: 'number',
        pos: [start + 36, start + 39],
        change: function (arr, e) {
          return num_change(arr, e.pos, e.value, 4);
        },
      },
      {
        key: 'records',
        value: array2num(arr.slice(start + 40, start + 44)),
        type: 'number',
        pos: [start + 40, start + 43],
        change: function (arr, e) {
          return num_change(arr, e.pos, e.value, 4);
        },
      },
    ],
  };
  start = start + 44;
  while (end > start) {
    var type = array2num(arr.slice(start, start + 4));
    var len = array2num(arr.slice(start + 4, start + 8));
    if (len < 0) break; // invalid len
    if (type === 2) (_a = flow.children) === null || _a === void 0 ? void 0 : _a.push(sflow_ethdata_decode(arr, start + 8));
    else if (type === 1001) (_b = flow.children) === null || _b === void 0 ? void 0 : _b.push(sflow_extswdata_decode(arr, start + 8));
    else if (type === 1) (_c = flow.children) === null || _c === void 0 ? void 0 : _c.push(sflow_rawpkthdr_decode(arr, start + 8));
    start += len + 8;
  }
  return flow;
}
function decode(arr, start) {
  var _a;
  var num_samples = array2num(arr.slice(start + 24, start + 28));
  var sflow = {
    key: 'sflow',
    pos: [start, start + 7],
    children: [
      {
        key: 'version',
        value: array2num(arr.slice(start, start + 4)),
        type: 'number',
        pos: [start, start + 3],
        change: function (arr, e) {
          return num_change(arr, e.pos, e.value, 4);
        },
      },
      {
        key: 'agent_addr_type',
        value: array2num(arr.slice(start + 4, start + 8)),
        type: 'number',
        pos: [start + 4, start + 7],
        change: function (arr, e) {
          return num_change(arr, e.pos, e.value, 4);
        },
      },
      {
        key: 'agent_addr',
        value: array2ipv4(arr.slice(start + 8, start + 12)),
        type: 'ipv4',
        pos: [start + 8, start + 11],
        change: function (arr, e) {
          return num_change(arr, e.pos, e.value, 4);
        },
      },
      {
        key: 'seq',
        value: array2num(arr.slice(start + 16, start + 20)),
        type: 'number',
        pos: [start + 16, start + 19],
        change: function (arr, e) {
          return num_change(arr, e.pos, e.value, 4);
        },
      },
      {
        key: 'uptime',
        value: array2num(arr.slice(start + 20, start + 24)),
        type: 'number',
        pos: [start + 20, start + 23],
        change: function (arr, e) {
          return num_change(arr, e.pos, e.value, 4);
        },
      },
      {
        key: 'num_samples',
        value: num_samples,
        type: 'number',
        pos: [start + 24, start + 27],
        change: function (arr, e) {
          return num_change(arr, e.pos, e.value, 4);
        },
      },
    ],
  };
  start = start + 28;
  while (arr.length > start && num_samples--) {
    var type = array2num(arr.slice(start, start + 4));
    var len = array2num(arr.slice(start + 4, start + 8));
    // console.log('type %d, len %d', type, len);
    if (len < 0) break; // invalid len
    if (type === 3) (_a = sflow.children) === null || _a === void 0 ? void 0 : _a.push(sflow_flow_decode(arr, start + 8));
    start += len + 8;
  }
  sflow.pos[1] = start - 1;
  return sflow;
}
export default {
  name: 'sflow',
  parents: [{ name: 'udp', pname: 'dport', pval: 6343 }],
  initval: initval,
  decode: decode,
};
