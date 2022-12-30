import { z } from "zod";

export const LegacyWaypointIcon = z.enum([
  "FLAG",
  "DIAMOND",
  "SIGN",
  "STAR",
  "TURRET",
  "LOOTCHEST_T4",
  "LOOTCHEST_T3",
  "LOOTCHEST_T2",
  "LOOTCHEST_T1",
  "FARMING",
  "FISHING",
  "MINING",
  "WOODCUTTING",
]);
export type LegacyWaypointIcon = z.infer<typeof LegacyWaypointIcon>;

export const LegacyWaypoint = z.object({
  name: z.string(),
  x: z.number(),
  y: z.number(),
  z: z.number(),
  zoomNeeded: z.number(), // 0 default -1000 always -1 hidden
  color: z.string(),
  type: LegacyWaypointIcon,
  group: LegacyWaypointIcon,
  showBeaconBeam: z.boolean(),
});
export type LegacyWaypoint = z.infer<typeof LegacyWaypoint>;

export const LegacyWaypoints = LegacyWaypoint.array();
export type LegacyWaypoints = z.infer<typeof LegacyWaypoints>;

export const LegacyPathWaypoint = z.object({
  name: z.string(),
  isCircular: z.boolean(),
  isEnabled: z.boolean(),
  color: z.string(),
  points: z.number().array().refine((v: number[]) => v.length % 3 == 0),
});
export type LegacyPathWaypoint = z.infer<typeof LegacyPathWaypoint>;

export const LegacyPathWaypoints = LegacyPathWaypoint.array();
export type LegacyPathWaypoints = z.infer<typeof LegacyPathWaypoints>;

export const LegacyConfig = z.object({
  waypoints: LegacyWaypoints,
  pathWaypoints: LegacyPathWaypoints,
});
export type LegacyConfig = z.infer<typeof LegacyConfig>;
