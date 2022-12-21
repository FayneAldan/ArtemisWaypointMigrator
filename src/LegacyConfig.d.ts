export type LegacyWaypointIcon =
  | "FLAG"
  | "DIAMOND"
  | "SIGN"
  | "STAR"
  | "TURRET"
  | "LOOTCHEST_T4"
  | "LOOTCHEST_T3"
  | "LOOTCHEST_T2"
  | "LOOTCHEST_T1"
  | "FARMING"
  | "FISHING"
  | "MINING"
  | "WOODCUTTING";

export type LegacyWaypoint = {
  name: string;
  x: number;
  y: number;
  z: number;
  zoomNeeded: number; // 0 default -1000 always -1 hidden
  color: string;
  type: LegacyWaypointIcon;
  group: LegacyWaypointIcon;
  showBeaconBeam: boolean;
};

export type LegacyConfig = {
  waypoints: LegacyWaypoint[];
};
