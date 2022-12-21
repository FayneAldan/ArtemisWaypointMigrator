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
  zoomNeeded: boolean;
  color: string; //"WHITE"
  type: LegacyWaypointIcon; //"FLAG"
  group: LegacyWaypointIcon; //"FLAG"
  showBeaconBeam: boolean;
};

export type LegacyPathWaypoint = {
  name: string;
  isCircular: boolean;
  isEnabled: boolean;
  color: string; // RED
  points: number[];
};

export type LegacyConfig = {
  waypoints: LegacyWaypoint[];
  pathWaypoints: LegacyPathWaypoint[];
  // iconFade: boolean;
  // iconFadeScale: number;
  // chestTiers: string; //"TIER_1"
  // compassMarker: boolean;
  // waypointSpacing: string; //"MEDIUM"
};
