import {
  allowNextShard,
  cache,
  controllers,
  delay,
  eventHandlers,
  initialMemberLoadQueue,
  ReadyPayload,
  setBotID,
  structures,
} from "../../deps.ts";

controllers.READY = async function (data, shardID) {
  if (data.t !== "READY") return;

  const payload = data.d as ReadyPayload;
  setBotID(payload.user.id);

  // Triggered on each shard
  eventHandlers.shardReady?.(shardID);
  if (payload.shard && shardID === payload.shard[1] - 1) {
    // Wait for 5 seconds to allow all guild create events to be processed
    await delay(5000);

    async function loadedAllGuilds() {
      // @ts-ignore
      if (payload.guilds.some((g) => !cache.guilds.has(g.id))) {
        setTimeout(() => loadedAllGuilds, 2000);
      } else {
        cache.isReady = true;
        eventHandlers.ready?.();

        // All the members that came in on guild creates should now be processed 1 by 1
        for (const [guildID, members] of initialMemberLoadQueue.entries()) {
          await Promise.all(
            members.map((member) => structures.createMember(member, guildID)),
          );
        }
      }
    }

    setTimeout(() => loadedAllGuilds(), 2000);
  }

  // Wait 5 seconds to spawn next shard
  await delay(5000);
  allowNextShard();
};
