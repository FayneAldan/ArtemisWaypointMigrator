import { z } from "https://deno.land/x/zod@v3.20.2/mod.ts";

export const ArtemisWaypointIcon = z.enum([
  "FLAG",
  "DIAMOND",
  "FIREBALL",
  "SIGN",
  "STAR",
  "WALL",
  "CHEST_T1",
  "CHEST_T2",
  "CHEST_T3",
  "CHEST_T4",
  "FARMING",
  "FISHING",
  "MINING",
  "WOODCUTTING",
]);
export type ArtemisWaypointIcon = z.infer<typeof ArtemisWaypointIcon>;

export const ArtemisWaypointVisibility = z.enum([
  "DEFAULT",
  "ALWAYS",
  "HIDDEN",
]);
export type ArtemisWaypointVisibility = z.infer<
  typeof ArtemisWaypointVisibility
>;

export const ArtemisWaypoint = z.object({
  name: z.string(),
  color: z.string(),
  icon: ArtemisWaypointIcon,
  visibility: ArtemisWaypointVisibility,
  location: z.object({
    x: z.number(),
    y: z.number().nullable(),
    z: z.number(),
  }),
});
export type ArtemisWaypoint = z.infer<typeof ArtemisWaypoint>;

export const ArtemisWaypoints = ArtemisWaypoint.array();
export type ArtemisWaypoints = z.infer<typeof ArtemisWaypoints>;

export const ArtemisConfig = z.object({
  "mapFeature.customPois": ArtemisWaypoints,
});
export type ArtemisConfig = z.infer<typeof ArtemisConfig>;
