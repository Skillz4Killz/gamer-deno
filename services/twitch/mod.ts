import { executeWebhook } from "../../deps.ts";
import { configs } from "./configs.ts";
import { db } from "../../src/database/database.ts";
import { chunkArrays } from "./utils.ts";

let bearer = { accessToken: "", expiresAt: 0 };

async function getAccessToken() {
  if (!bearer.accessToken || bearer.expiresAt < Date.now() + 300000) {
    const response = await fetch(
      `https://id.twitch.tv/oauth2/token?client_id=${configs.clientID}&client_secret=${configs.clientSecret}&grant_type=client_credentials`,
      { method: "POST" }
    ).then((r) => r.json());

    bearer.accessToken = response.access_token;
    bearer.expiresAt = Date.now() + response.expires_in * 1000;
  }

  return bearer.accessToken;
}

async function fetchStream(channelIDs: string[]) {
  const accessToken = await getAccessToken();

  const data = await fetch(
    `https://api.twitch.tv/helix/streams?user_login=${channelIDs.join(
      "&user_login="
    )}`,
    {
      headers: {
        "Client-ID": configs.clientID,
        Authorization: `Bearer ${accessToken}`,
      },
    }
  )
    .then((data) => data.json())
    .catch(console.log);

  return data.data;
}

// TODO: Maybe add a Rate Limit check?
async function fetchStreams(channelIDs: string[]) {
  if (channelIDs.length > 100) {
    const data = await Promise.all(
      (chunkArrays(channelIDs) as string[][]).map((chunk) => fetchStream(chunk))
    );
    return new Map(data.flat().map((stream) => [stream.user_name, stream]));
  }

  const data = await fetchStream(channelIDs);

  return new Map(data.map((stream: any) => [stream.user_name, stream]));
}

let allowNotification = false;
const recent = new Map<string, string[]>();

async function processTwitchSubscriptions() {
  console.log("[Twitch] Processing Subscriptions");

  const twitchSubs = await db.twitch.findMany({}, true);

  const streams = await fetchStreams(twitchSubs.map((sub) => sub.id));
  console.log(`[Twitch]: ${streams.size} streams fetched.`);

  for (const twitchSub of twitchSubs) {
    if (!streams.has(twitchSub.id) || !allowNotification) continue;

    for (const sub of twitchSub.subscriptions) {
      if (
        sub.filter &&
        !streams.get(twitchSub.id).title.includes(sub.filter) &&
        !streams.get(twitchSub.id).game_name.includes(sub.filter)
      )
        return;

      if (recent.get(twitchSub.id)?.includes(streams.get(twitchSub.id).id))
        return;

      executeWebhook(sub.webhookID, sub.webhookToken, {
        embeds: [
          {
            title: `${
              streams.get(twitchSub.id).user_name
            } is streaming on Twitch right now!`,
            description: `[${
              streams.get(twitchSub.id).title
            }](https://twitch.tv/${streams.get(twitchSub.id).user_name})`,
            image: {
              url: streams
                .get(twitchSub.id)
                .thumbnail_url.replace("{width}x{height}", "1280x720"),
            },
            color: 6570405,
            timestamp: new Date(Date.now()).toISOString(),
          },
        ],
      }).catch((error) => {
        console.log("[Twitch] Embed Sending Error:", error);
        console.log(
          "[Twitch] Embed Sending Error 2:",
          streams.get(twitchSub.id)
        );
      });
    }

    recent.set(twitchSub.id, streams.get(twitchSub.id).id);
  }

  if (!allowNotification) allowNotification = true;
  setTimeout(() => processTwitchSubscriptions(), 60000 * 3);

  // Clear ended streams from cache
  for (let k of recent.keys()) {
    if (!streams.has(k)) recent.delete(k);
  }
}

processTwitchSubscriptions();
