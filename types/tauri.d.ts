export interface AppFlowStat {
  name: string;
  totalcnt: number;
  rate: number;
}

export interface AppNetIf {
  name: string;
  ipv4: string;
}

export interface AppConf {
  ifname?: string;
  stat_interval: number;
  data_dir?: string;
  protocol_dir?: string;
}
