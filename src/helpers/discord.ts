import { botCache } from "../../mod.ts";
import { GuildSchema } from "../database/schemas/guilds.ts";
import { Message } from "../../deps.ts";

botCache.helpers.isModOrAdmin = (message: Message, settings: GuildSchema) => {
  const member = message.member();
  if (!member) return false;

  if (member.roles.includes(settings.adminRoleID)) return true;
  return settings.modRoleIDs.some((id) => member.roles.includes(id));
};

botCache.helpers.snowflakeToTimestamp = function (id: string) {
  return Math.floor(Number(id) / 4194304) + 1420070400000;
};
