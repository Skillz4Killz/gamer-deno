import { botCache } from "../../mod.ts";
import { memberIDHasPermission } from "../../deps.ts";

botCache.helpers.isModOrAdmin = (message, settings) => {
  const member = message.member();
  if (!member) return false;

  if (member.roles.includes(settings.adminRoleID)) return true;
  return settings.modRoleIDs.some((id) => member.roles.includes(id));
};

botCache.helpers.isAdmin = (message, settings) => {
  const member = message.member();
  const hasAdminPerm = memberIDHasPermission(
    message.author.id,
    message.guildID,
    ["ADMINISTRATOR"],
  );
  if (hasAdminPerm) return true;

  return member && settings?.adminRoleID
    ? member.roles.includes(settings.adminRoleID)
    : false;
};

botCache.helpers.snowflakeToTimestamp = function (id: string) {
  return Math.floor(Number(id) / 4194304) + 1420070400000;
};
