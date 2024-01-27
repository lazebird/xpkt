export interface MutPolicy {
  name?: string;
  pos: Array<number>;
  mtd: 'inc' | 'dec' | 'rand';
  step?: number;
}

export interface TxPolicy {
  count?: number;
  rate?: number;
  delay?: number;
}

export interface FlowItem {
  name: string;
  pkt: Array<number>;
  muts: Array<MutPolicy>;
  tx: TxPolicy;
  structs?: Array<string>;
}

export interface FlowConf {
  flows: Array<FlowItem>;
  ifname: string | undefined;
  selected_keys: Array<number>;
}
