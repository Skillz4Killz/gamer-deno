import { GamerMessage } from "../../base/GamerMessage.js";
import { Command, PermissionLevels } from "../../base/typings.js";
import { Gamer } from "../../bot.js";

export async function hasEnoughPermissionLevel(message: GamerMessage, command: Command): Promise<boolean> {
    // If no permission level is required, everyone is able to use
    if (!command.requiredPermissionLevel) return false;

    switch (command.requiredPermissionLevel) {
        case PermissionLevels.Admin:
            if (!message.guildId) {
                const reason = `[Inhibitor] ${command.name} inhibited from ADMIN permission level because command was not done in a guild.`;
                if (message.isOnDiscord) Gamer.loggers.discord.info(reason);
                else Gamer.loggers.guilded.info(reason);

                return true;
            }

            if (message.isDiscordInteraction(message.raw) && message.raw.member?.permissions?.has("ADMINISTRATOR")) return false;
            if (message.isDiscordMessage(message.raw) && message.raw.member?.permissions?.has("ADMINISTRATOR")) return false;

            // TODO: perms - guilded perms
            if (!message.isOnDiscord) return false;
            break;
    }

    const reason = `[Inhibitor] ${command.name} inhibited from ${command.requiredPermissionLevel} level.`;
    if (message.isOnDiscord) Gamer.loggers.discord.info(reason);
    else Gamer.loggers.guilded.info(reason);

    return true;
}
