import { botCache, cache, fetchMembers } from "../../../../deps.ts";
import { db } from "../../../database/database.ts";
import { createSubcommand } from "../../../utils/helpers.ts";

createSubcommand("events", {
  name: "add",
  aliases: ["a"],
  cooldown: {
    seconds: 10,
  },
  arguments: [
    { name: "eventID", type: "number" },
    { name: "roleIDs", type: "...roles" },
  ],
  guildOnly: true,
  execute: async function (message, args: EventsAddArgs, guild) {
    if (!guild) return;

    const event = await db.events.findOne(
      { guildID: message.guildID, eventID: args.eventID },
    );
    if (!event) return botCache.helpers.reactError(message);

    // Add all user mentions
    const userIDs = new Set([...message.mentions]);

    if (botCache.vipGuildIDs.has(message.guildID)) {
      // Fetch members if necessary
      if (
        guild.memberCount !==
          cache.members.filter((m) => m.guilds.has(message.guildID)).size
      ) {
        await fetchMembers(guild);
      }

      for (const id of args.roleIDs) {
        const role = guild.roles.get(id);
        if (!role) continue;

        for (const member of cache.members.values()) {
          if (!member.guilds.get(message.guildID)?.roles.includes(id)) continue;
          userIDs.add(member.id);
        }
      }
    }

    for (const id of userIDs) {
      // If there is space to join
      if (event.maxAttendees > event.acceptedUsers.length) {
        // Remove this id from the event
        event.waitingUsers = event.waitingUsers.filter((user) =>
          user.id !== message.author.id
        );
        event.acceptedUsers.push({ id, position: "" });
        event.maybeUserIDs = event.maybeUserIDs.filter((id) =>
          id !== message.author.id
        );
        event.deniedUserIDs = event.deniedUserIDs.filter((id) =>
          id !== message.author.id
        );

        continue;
      }

      // There is no space and user is already waiting
      if (
        event.waitingUsers.some((user) => user.id === message.author.id)
      ) {
        continue;
      }

      // Add user to waiting list
      event.waitingUsers.push({ id: message.author.id, position: "" });
      event.deniedUserIDs = event.deniedUserIDs.filter((id) =>
        id !== message.author.id
      );
    }

    botCache.helpers.reactSuccess(message);
    await db.events.update(event.id, event);

    // Trigger card again
    botCache.commands.get("events")?.subcommands?.get("card")?.execute?.(
      message,
      { eventID: args.eventID },
      guild,
    );
  },
});

interface EventsAddArgs {
  eventID: number;
  roleIDs: string[];
}
