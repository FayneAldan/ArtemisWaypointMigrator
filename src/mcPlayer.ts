type PlayerData = {
  meta: {
    cached_at: number;
  };
  username: string;
  id: string;
  raw_id: string;
  avatar: string;
  name_history: string[];
};

type LookupSuccess = {
  code: string;
  message: string;
  data: {
    player: PlayerData;
  };
  success: true;
};

type LookupFailed = {
  message: string;
  code: string;
  success: false;
  error: boolean;
};

type LookupResult = LookupSuccess | LookupFailed;

const cache: Record<string, LookupResult> = {};

export async function lookupPlayer(id: string): Promise<PlayerData> {
  const lookup: LookupResult = cache[id] || await (await fetch(
    `https://playerdb.co/api/player/minecraft/${id}`,
    {
      headers: {
        "user-agent": "github.com/FayneAldan/ArtemisWaypointMigrator",
      },
    },
  )).json();
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
