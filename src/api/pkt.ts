import { ProtocolConfig, ProtocolNode } from '#/protocol';
import { message } from 'ant-design-vue';

export function check_parent(proto: ProtocolConfig, section: ProtocolNode | undefined) {
  // console.log('proto %o, section %o', proto, section);
  if (proto.parents === null) return !section;
  if (!section) return false;
  for (const p of proto.parents) {
    if (p.name === section.key) {
      if (!p.pname) return true;
      const q = section.children?.find((e) => e.key === p.pname);
      // console.log('qval %o, pval %o', q?.value, p.pval);
      if (q?.value === p.pval) return true;
      if (typeof p.pval === 'number' && Number(q?.value) === p.pval) return true;
    }
  }
  return false;
}

export function get_protos(section: ProtocolNode | undefined, protos: Array<ProtocolConfig>) {
  const arr = [];
  if (section?.key === 'payload') return [];
  for (const p of protos) if (check_parent(p, section)) arr.push(p);
  // console.log('section %o, protos %o', section, arr);
  return arr;
}

export function get_best_proto(arr: Array<ProtocolConfig>) {
  const best_prio = Math.min(...arr.map((e) => e.priority ?? 100));
  return arr.find((e) => (e.priority ? e.priority === best_prio : best_prio === 100));
}

export function pkt_decode(data: Array<number>, protos: Array<ProtocolConfig>) {
  const sections: Array<ProtocolNode> = [];
  let config;
  let parseLen = 0;
  let loop = 1; // avoid deadloop, for debug only
  try {
    while (parseLen < data.length && loop++) {
      const p = get_best_proto(get_protos(sections.at(-1), protos));
      // console.log('parse len %d, total len %d, get protos %o for section %o', parseLen, data.length, p, sections);
      if (!p) break;
      config = p.decode(data, parseLen);
      if (!config) throw new Error(`Protocol '${p.name}' decode ret error`);
      sections.push(config);
      parseLen = config.pos[1] + 1;
      if (loop > 50) throw new Error(`Deadloop detected, current protocol ${p.name}, parseLen ${parseLen}, data length ${data.length}`);
    }
  } catch (error) {
    message.error(`pkt decode error: ${error}`, 5);
  }
  // console.log('data ', sections);
  return sections;
}
