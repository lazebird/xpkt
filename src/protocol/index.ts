import eth from './eth';
import dot1q from './dot1q';
import arp from './arp';
import ipv4 from './ipv4';
import ipv6 from './ipv6';
import icmp from './icmp';
import icmpv6 from './icmpv6';
import udp from './udp';
import tcp from './tcp';
import sflow from './sflow';
import payload from './payload';
import { ProtocolConfig } from '#/protocol';

export default [eth, dot1q, arp, ipv4, ipv6, icmp, icmpv6, udp, tcp, sflow, payload] as ProtocolConfig[];
