import { z } from "https://deno.land/x/zod@v3.20.2/mod.ts";

const PlayerData = z.object({
  meta: z.object({
    cached_at: z.number(),
  }),
  username: z.string(),
  id: z.string().uuid(),
  raw_id: z.string().length(32).regex(/^[0-9a-z]{32}$/),
  avatar: z.string().url(),
  name_history: z.string().array(),
});
type PlayerData = z.infer<typeof PlayerData>;

const LookupSuccess = z.object({
  code: z.string(),
  message: z.string(),
  data: z.object({
    player: PlayerData,
  }),
  success: z.literal(true),
});
type LookupSuccess = z.infer<typeof LookupSuccess>;

const LookupFailed = z.object({
  message: z.string(),
  code: z.string(),
  success: z.literal(false),
  error: z.boolean(),
});
type LookupFailed = z.infer<typeof LookupFailed>;

const LookupResult = z.discriminatedUnion("success", [
  LookupSuccess,
  LookupFailed,
]);
type LookupResult = z.infer<typeof LookupResult>;

const cache: Record<string, LookupResult> = {};

export async function lookupPlayer(id: string): Promise<PlayerData> {
  const lookup = cache[id] || LookupResult.parse(
    await (await fetch(
      `https://playerdb.co/api/player/minecraft/${id}`,
      {
        headers: {
          "user-agent": "github.com/FayneAldan/ArtemisWaypointMigrator",
        },
      },
    )).json(),
  );
  cache[id] = lookup;
  if (!lookup.success) {
    throw new Error(lookup.message);
  }
  const player = lookup.data.player;
  cache[player.username] = lookup;
  cache[player.id] = lookup;
  cache[player.raw_id] = lookup;
  return player;
}

export async function lookupUsername(id: string): Promise<string> {
  return (await lookupPlayer(id)).username;
}

export async function lookupUUID(id: string): Promise<string> {
  return (await lookupPlayer(id)).raw_id;
}
