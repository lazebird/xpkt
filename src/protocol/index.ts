import eth from './eth';
import dot1q from './dot1q';
import arp from './arp';
import ipv4 from './ipv4';
// import ipv6 from './ipv6';
import icmp from './icmp';
import udp from './udp';
import sflow from './sflow';
import payload from './payload';
import { ProtocolConfig } from '#/protocol';

export default [eth, dot1q, arp, ipv4, icmp, udp, sflow, payload] as ProtocolConfig[];
