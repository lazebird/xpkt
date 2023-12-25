interface ProtocolDecodeFn {
  (_arr: Array<number>, _start: number): ProtocolConfig;
}

interface ProtocolChangeFn {
  (_arr: Array<number>, _e: ProtocolConfig): Array<number>;
}

interface ProtocolCheckFn {
  (_arr: Array<number>, _e: ProtocolConfig): any;
}
interface ProtocolUpdateFn {
  (_arr: Array<number>, _e: ProtocolConfig): Array<number>;
}

export interface ProtocolParentItem {
  name: string;
  pname: string;
  pval: any;
}
export interface ProtocolConfig {
  key: string;
  pos: Array<number>;
  children?: Array<ProtocolConfig>;
  type?: 'number' | 'mac' | 'ipv4' | 'hex' | 'pkt';
  value?: any;
  options?: Array<any>;
  status?: 'error';
  change?: ProtocolChangeFn;
  check?: ProtocolCheckFn;
  update?: ProtocolUpdateFn;
}
export interface ProtocolItem {
  name: string;
  priority?: number;
  parents: string | Array<ProtocolParentItem>;
  initval: Array<number>;
  decode: ProtocolDecodeFn;
}
