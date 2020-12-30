import { botCache } from "../../deps.ts";

botCache.eventHandlers.shardReady = function (shardID) {
  console.log(`[Shard Ready] Shard ${shardID} is ready`);
};
