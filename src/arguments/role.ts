import { Argument } from "../base/typings.js";

export const role: Argument = {
    name: "role",
    async execute(_, parameters, message) {
        const [id] = parameters;
        if (!id) return;

        const guild = await message.getGuild();
        if (!guild) return;

        const roleID = id.startsWith("<@&") ? id.substring(3, id.length - 1) : id;

        const name = id.toLowerCase();
        const role = guild.roles.get(roleID) || guild.roles.find((r) => r.name.toLowerCase() === name);
        if (role) return role;

        // No role was found, let's list roles for better user experience.
        const possibleRoles = guild.roles.filter((r) => r.name.toLowerCase().startsWith(name));
        if (!possibleRoles.size) return;

        await message.reply(
            [
                message.translate("NEED_VALID_ROLE", { name: id }),
                message.translate("POSSIBLE_ROLES"),
                "",
                possibleRoles.map((r) => `**${r.name}** ${r.id}`).join("\n"),
            ].join("\n"),
        );
    },
};
