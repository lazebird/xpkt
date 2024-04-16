import eth from './eth';
import dot1q from './dot1q';
import ipv4 from './ipv4';
import udp from './udp';
import sflow from './sflow';
import payload from './payload';
import { ProtocolConfig } from '#/protocol';

export default [eth, dot1q, ipv4, udp, sflow, payload] as ProtocolConfig[];
