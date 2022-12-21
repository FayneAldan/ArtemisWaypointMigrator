export type ArtemisWaypointIcon =
  | "FLAG"
  | "DIAMOND"
  | "FIREBALL"
  | "SIGN"
  | "STAR"
  | "WALL"
  | "CHEST_T1"
  | "CHEST_T2"
  | "CHEST_T3"
  | "CHEST_T4"
  | "FARMING"
  | "FISHING"
  | "MINING"
  | "WOODCUTTING";

export type ArtemisWaypointVisibility = "DEFAULT" | "ALWAYS" | "HIDDEN";

export type ArtemisWaypoint = {
  name: string;
  color: string;
  icon: ArtemisWaypointIcon;
  visibility: ArtemisWaypointVisibility;
  location: {
    x: number;
    y: number | null;
    z: number;
  };
};

export type ArtemisConfig = {
  "mapFeature.customPois": ArtemisWaypoint[];
};
