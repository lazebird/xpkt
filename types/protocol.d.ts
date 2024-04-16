interface ProtocolDecodeFn {
  (_arr: Array<number>, _start: number): ProtocolNode;
}

interface ProtocolChangeFn {
  (_arr: Array<number>, _e: ProtocolNode): Array<number>;
}

interface ProtocolCheckFn {
  (_arr: Array<number>, _e: ProtocolNode): any;
}
interface ProtocolCalcFn {
  (_arr: Array<number>, _e: ProtocolNode): Array<number>;
}

export interface ProtocolParentConfig {
  name: string;
  pname?: string;
  pval?: any;
}
export interface ProtocolNode {
  key: string;
  pos: Array<number>;
  children?: Array<ProtocolNode>;
  type?: 'number' | 'mac' | 'ipv4' | 'ipv6' | 'hex' | 'pkt';
  value?: any;
  options?: Array<any>;
  status?: 'error';
  change?: ProtocolChangeFn;
  check?: ProtocolCheckFn;
  calc?: ProtocolCalcFn;
}
export interface ProtocolConfig {
  name: string;
  priority?: number;
  parents: Array<ProtocolParentConfig> | null;
  initval: Array<number>;
  decode: ProtocolDecodeFn;
  allow_payload?: boolean;
}
