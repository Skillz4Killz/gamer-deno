import { KeysMatching } from "../typings.js";

export const english = {
    // Misc
    NONE: "None",
    CLEAR_SPAM: "Remove spam messages.",
    INVALID_USER_ID: "❌ Invalid user ID provided!",
    VIP_USER_ID: "⚠️ User id functionality is only available for VIP servers. To check without VIP, you need to `@user` or use / commands bruh.",
    MISSING_REQUIRED_ARG: (name: string, type: string) =>
        `You were missing the **${name}** argument which is required in that command. Please provide the **${type}** now.`,

    // Boolean Argument
    TRUE: "true",
    FALSE: "false",
    ON: "on",
    OFF: "off",
    ENABLE: "enable",
    DISABLE: "disable",

    // Role Argument
    NEED_VALID_ROLE: "A valid role was not found using the name **{{name}}**.",
    POSSIBLE_ROLES:
        "A few possible roles that you may wish to use were found. Listed below are the role names and ids. Try using the id of the role you wish to use.",

    // Avatar Command
    AVATAR_NAME: "avatar",
    AVATAR_DESCRIPTION: "🖼️ Shows the avatar of a user or yourself.",
    AVATAR_USER_NAME: "user",
    AVATAR_USER_DESCRIPTION: "Provide a @user to view their avatar.",
    AVATAR_DOWNLOAD_LINK: "🔗 Download Link",

    // Info Command
    INFO_NAME: "info",
    INFO_DESCRIPTION: "ℹ️ Get info of a user or yourself",
    INFO_USER_NAME: "user",
    INFO_USER_DESCRIPTION: "The user",
    INFO_NICKNAME: "Nickname",
    INFO_USER_ID: "User ID",
    INFO_CREATED_ON: "Created on",
    INFO_JOINED_ON: "Joined on",
    INFO_PERMISSIONS: "Permissions",
    INFO_ROLES: "Roles",

    // Invite Command
    INVITE_NAME: "invite",
    INVITE_DESCRIPTION: "🔗 Invite the bot to your server or get help in the support server.",
    INVITE_BOT: "Invite The Bot",
    INVITE_NEED_SUPPORT: "Need Help?",
    INVITE_THANKS: "Thank you for using Gamer bot!",

    // Ping Command
    PING_NAME: "ping",
    PING_DESCRIPTION: "🏓 Shows the response time for the bot.",
    PING_TIME: (time: number) => `🏓 **Response Time**: \`${time}\` seconds 🕙`,

    // Gif command
    GIF_NAME: "gif",
    GIF_DESCRIPTION: "Send a random gif!",
    GIF_NAME_NAME: "name",
    GIF_NAME_DESCRIPTION: "the gif name",
    GIF_BAKA_NAME: "baka",
    GIF_BAKA_DESCRIPTION: "baka",
    GIF_RAPHTALIA_NAME: "raphtalia",
    GIF_RAPHTALIA_DESCRIPTION: "raphtalia",
    GIF_COMPLIMENT_NAME: "compliment",
    GIF_COMPLIMENT_DESCRIPTION: "compliment",
    GIF_CUDDLE_NAME: "cuddle",
    GIF_CUDDLE_DESCRIPTION: "cuddle",
    GIF_MAVIS_NAME: "mavis",
    GIF_MAVIS_DESCRIPTION: "mavis",
    GIF_KISS_NAME: "kiss",
    GIF_KISS_DESCRIPTION: "kiss",
    GIF_HUG_NAME: "hug",
    GIF_HUG_DESCRIPTION: "hug",
    GIF_POKE_NAME: "poke",
    GIF_POKE_DESCRIPTION: "poke",
    GIF_PAT_NAME: "pat",
    GIF_PAT_DESCRIPTION: "pat",
    GIF_PONY_NAME: "pony",
    GIF_PONY_DESCRIPTION: "pony",
    GIF_PUPPY_NAME: "puppy",
    GIF_PUPPY_DESCRIPTION: "puppy",
    GIF_SLAP_NAME: "slap",
    GIF_SLAP_DESCRIPTION: "slap",
    GIF_TICKLE_NAME: "tickle",
    GIF_TICKLE_DESCRIPTION: "tickle",
    GIF_BITE_NAME: "bite",
    GIF_BITE_DESCRIPTION: "bite",
    GIF_DANCE_NAME: "dance",
    GIF_DANCE_DESCRIPTION: "dance",
    GIF_LMAO_NAME: "lmao",
    GIF_LMAO_DESCRIPTION: "lmao",
    GIF_CRY_NAME: "cry",
    GIF_CRY_DESCRIPTION: "cry",
    GIF_ZEROTWO_NAME: "zerotwo",
    GIF_ZEROTWO_DESCRIPTION: "zerotwo",
    GIF_KANNA_NAME: "kanna",
    GIF_KITTEN_NAME: "kitten",
    GIF_SUPERNATURAL_NAME: "supernatural",
    GIF_NEZUKO_NAME: "nezuko",
    GIF_KANNA_DESCRIPTION: "kanna",
    GIF_KITTEN_DESCRIPTION: "kitten",
    GIF_SUPERNATURAL_DESCRIPTION: "supernatural",
    GIF_NEZUKO_DESCRIPTION: "nezuko",

    // Random command
    RANDOM_NAME: "random",
    RANDOM_DESCRIPTION: "🔢 Pick a random number, send a random advice or ask 8ball a random question.",
    RANDOM_NUMBER_NAME: "number",
    RANDOM_NUMBER_DESCRIPTION: "🔢 Pick a random number",
    RANDOM_NUMBER_MINIMUM: "Minimum",
    RANDOM_NUMBER_MAXIMUM: "Maximum",
    RANDOM_NUMBER_MAX_WAS_TOO_LOW: "The max number was too low. Set max as high as possible.",
    RANDOM_NUMBER_MIN_NAME: "min",
    RANDOM_NUMBER_MIN_DESCRIPTION: "🔢 The random number will be higher than this minimum.",
    RANDOM_NUMBER_MAX_NAME: "max",
    RANDOM_NUMBER_MAX_DESCRIPTION: "🔢 The random number will be lower than this maximum.",
    RANDOM_8BALL_NAME: "8ball",
    RANDOM_8BALL_DESCRIPTION: "🔮 Get answers to your questions!",
    RANDOM_8BALL_QUESTION_NAME: "question",
    RANDOM_8BALL_QUESTION_DESCRIPTION: "🔮 What question would you like to ask?",
    RANDOM_ADVICE_NAME: "advice",
    RANDOM_ADVICE_DESCRIPTION: "🗨️ Receive random advice in the chat.",

    RANDOM_ADVICE_QUOTES: [
        "**Take time to know yourself.** `Know thyself` said Aristotle. When you know who you are, you can be wise about your goals, your dreams, your standards, your convictions. Knowing who you are allows you to live your life with purpose and meaning.",
        "**A narrow focus brings big results.** The number one reason people give up so fast is because they tend to look at how far they still have to go instead of how far they have come. But it's a series of small wins that can give us the most significant success.",
        "**Show up fully.** Don't dwell on the past, and don't daydream about the future, but concentrate on showing up fully in the present moment.",
        "**Don't make assumptions.** If you don't know the situation fully, you can't offer an informed opinion.",
        "**Be patient and persistent.** Life is not so much what you accomplish as what you overcome.",
        "**In order to get, you have to give.** If you support, guide, and lead others, if you make contributions to their lives, you will reap the best rewards.",
        "**Luck comes from hard work.** Luck happens when hard work and timing and talent intersect.",
        "**Be your best at all times.** You never know what the future will bring, so always make the best use of the present.",
        "**Don't try to impress everyone.** The unhappiest people are those who care the most about what other people think.",
        "**Don't be afraid of being afraid.** Sometimes the one thing you need for growth is the one thing you are most afraid to do.",
        "**Listen to learn. Learn how to listen.** You can't learn anything when you're talking.",
        "**Life's good, but it's not fair.** The delusion that life's supposed to be fair is the source of much unhappiness.",
        "**No task is beneath you.** Don't put yourself above anyone or anything; work hard in silence and let success make the noise.",
        "**You can't always get what you want.** But, as the song says, if you try you may find you get what you need.",
        "**Don't make decisions when you are angry or ecstatic.** The best decisions are made with a clear conscious mind, not in the throes of any emotion - positive or negative.",
        "**Don't worry what other people think.** Personality begins where comparison leaves off. Be unique. Be memorable. Be confident. Be proud.",
        "**Use adversity as an opportunity.** Every loss leads to an opportunity, and every adversity leads to new possibilities.",
        "**Do what is right, not what is easy.** Strength of character leads us to do the right thing, even when there are easier options.",
        "**Dreams remain dreams until you take action.** Without action, an idea is just a dream.",
        "**Treat others the way you want to be treated.** Do right. Do your best. Treat others as you would want them to treat you.",
        "**When you quit, you fail.** The surest way to lose at any endeavor is to quit. But fatigue, discomfort, and discouragement are merely symptoms of effort.",
        "**Trust your instincts.** What good is intuition if you let second-guessing drown it out? The worst enemy of success is self-doubt.",
        "**Learn something new every day.** Have the mindset of a student. Never think you are too old to ask questions or know too much to learn something new.",
        "**Make what is valuable important.** Instead of thinking about what is profitable, think about what is valuable. Invest in others and you will grow your portfolio.",
        "**Believe in yourself.** The way you see yourself is the way you will treat yourself, and the way you treat yourself is what you become.",
        "**Don’t look at the calendar.** Just keep celebrating every day.",
        "**Invest in quality pieces,** they never go out of style.",
        "**I make myself go out every day,** even if it’s only to walk around the block. The key to staying young is to keep moving.",
    ],
    RANDOM_8BALL_QUOTES: [
        "✅ Totally!",
        "✅ Yes!",
        "✅ Definitely!",
        "✅ Very likely.",
        "🤷 Likely.",
        "🤷 Probably.",
        "🤷 Unlikely.",
        "🤷 I wouldn't count on it.",
        "❌ No!",
        "❌ Definitely not!",
        "❌ Nope!",
        "❌ No way!",
    ],

    // Roles Command
    ROLES_NAME: "roles",
    ROLES_DESCRIPTION: "⚙️ Manage the roles on your server.",
    ROLES_MESSAGES_NAME: "messages",
    ROLES_MESSAGES_DESCRIPTION: "🗨️ Sends a message whenever a user gains or loses a role.",
    ROLES_MESSAGES_CREATE_NAME: "create",
    ROLES_MESSAGES_CREATE_DESCRIPTION: "🆕 Creates a new role message.",
    ROLES_MESSAGES_CREATE_TYPE_NAME: "new",
    ROLES_MESSAGES_CREATE_TYPE_DESCRIPTION: "🆕 Send the message when user gets a new role.",
    ROLES_MESSAGES_CREATE_TYPE_ROLE_ADDED_TO_USER_NAME: "Role Added To User",
    ROLES_MESSAGES_CREATE_TYPE_ROLE_REMOVED_FROM_USER_NAME: "Role Removed From User",
    ROLES_MESSAGES_CREATE_ROLE_NAME: "role",
    ROLES_MESSAGES_CREATE_ROLE_DESCRIPTION: "⚙️ Which role should be used to determine when to send this message?",
    ROLES_MESSAGES_CREATE_CHANNEL_NAME: "channel",
    ROLES_MESSAGES_CREATE_CHANNEL_DESCRIPTION: "Which channel should we send this message in?",
    ROLES_MESSAGES_CREATE_CONTENT_NAME: "content",
    ROLES_MESSAGES_CREATE_CONTENT_DESCRIPTION: "💬 The text or embed you wish to send",
    ROLES_MESSAGES_DELETE_NAME: "delete",
    ROLES_MESSAGES_DELETE_DESCRIPTION: "🗑️ Deletes a role message.",
    ROLES_MESSAGES_DELETE_ROLE_NAME: "role",
    ROLES_MESSAGES_DELETE_ROLE_DESCRIPTION: "🆔 Which role message do you wish to delete?",
    ROLES_MESSAGES_CREATE_SUCCESS: "✅ The role message was created.",
    ROLES_MESSAGES_DELETE_SUCCESS: "✅ The role message was deleted.",
    ROLES_MESSAGES_LIST_NAME: "list",
    ROLES_MESSAGES_LIST_DESCRIPTION: "🗒️ View the role messages on the server.",
    ROLES_MESSAGES_LIST_NONE: "❌ I do not see any role messages on this server.",
    ROLES_MESSAGES_LIST_CHANNEL: (channelId: string) => `#️⃣ **Send Message To:** <#${channelId}>`,
    ROLES_MESSAGES_LIST_ADDED: (text: string ) => `💬 **Message When Role Added:** ${text}`,
    ROLES_MESSAGES_LIST_REMOVED: (text: string ) => `💬 **Message When Role Removed:** ${text}`,
    ROLES_UNIQUE_NAME: "unique",
    ROLES_UNIQUE_DESCRIPTION: "Unique role sets automatically removes other roles in the set if a user gains a role.",
    ROLES_UNIQUE_CREATE_NAME: "create",
    ROLES_UNIQUE_CREATE_DESCRIPTION: "🆕 Creates a roleset.",
    ROLES_UNIQUE_CREATE_CUSTOM_NAME: "name",
    ROLES_UNIQUE_CREATE_CUSTOM_DESCRIPTION: "🖊️ The name you want to call this roleset.",
    ROLES_UNIQUE_CREATE_ROLE_NAME: "role",
    ROLES_UNIQUE_CREATE_ROLE_DESCRIPTION: "🆔 Which role would you like in the set?",
    ROLES_UNIQUE_CREATE_ROLE2_NAME: "role2",
    ROLES_UNIQUE_CREATE_ROLE2_DESCRIPTION: "🆔 Which role would you like in the set?",
    ROLES_UNIQUE_CREATE_SUCCESS: "✅ The unique role set was created.",
    ROLES_UNIQUE_DELETE_NAME: "delete",
    ROLES_UNIQUE_DELETE_DESCRIPTION: "🗑️ Deletes a roleset.",
    ROLES_UNIQUE_DELETE_CUSTOM_NAME: "name",
    ROLES_UNIQUE_DELETE_CUSTOM_DESCRIPTION: "🖊️ The name of the roleset you wish to delete.",
    ROLES_UNIQUE_DELETE_SUCCESS: "✅ The unique role set was deleted. 🗑️",
    ROLES_UNIQUE_NOT_FOUND: "⁉️ The unique role set was not found.",
    ROLES_UNIQUE_ADD_NAME: "add",
    ROLES_UNIQUE_ADD_DESCRIPTION: "➕ Add another role to a unique role set.",
    ROLES_UNIQUE_ADD_CUSTOM_NAME: "name",
    ROLES_UNIQUE_ADD_CUSTOM_DESCRIPTION: "🖊️ The name of the roleset you wish to edit.",
    ROLES_UNIQUE_ADD_ROLE_NAME: "role",
    ROLES_UNIQUE_ADD_ROLE_DESCRIPTION: "🆔 Which role would you like to add in the set?",
    ROLES_UNIQUE_ADD_SUCCESS: "✅ The role has been added to the set.",
    ROLES_UNIQUE_REMOVE_NAME: "remove",
    ROLES_UNIQUE_REMOVE_DESCRIPTION: "➖ Remove a role to a unique role set.",
    ROLES_UNIQUE_REMOVE_CUSTOM_NAME: "name",
    ROLES_UNIQUE_REMOVE_CUSTOM_DESCRIPTION: "🖊️ The name of the roleset you wish to edit.",
    ROLES_UNIQUE_REMOVE_ROLE_NAME: "role",
    ROLES_UNIQUE_REMOVE_ROLE_DESCRIPTION: "🆔 Which role would you like to remove from the set?",
    ROLES_UNIQUE_REMOVE_SUCCESS: "✅ The role has been removed from the set.",
    ROLES_UNIQUE_LIST_NAME: "list",
    ROLES_UNIQUE_LIST_DESCRIPTION: "🗒️ View the unique role sets on the server.",
    ROLES_UNIQUE_LIST_NONE: "❌ There are no unique role sets saved in the database for this server.",
    ROLES_UNIQUE_LIST_TITLE: "List of Unique Role Sets",
    ROLES_GROUPED_NAME: "grouped",
    ROLES_GROUPED_DESCRIPTION: "➕ Automatically add roles from a group to a user when they gain a specifc role.",
    ROLES_GROUPED_CREATE_NAME: "create",
    ROLES_GROUPED_CREATE_DESCRIPTION: "🆕 Creates a roleset.",
    ROLES_GROUPED_CREATE_NAME_NAME: "name",
    ROLES_GROUPED_CREATE_NAME_DESCRIPTION: "The name of the roleset you would like create.",
    ROLES_GROUPED_CREATE_ROLE_NAME: "role",
    ROLES_GROUPED_CREATE_ROLE_DESCRIPTION: "🆔 Which role would you like to be watching for?",
    ROLES_GROUPED_CREATE_ROLE2_NAME: "role2",
    ROLES_GROUPED_CREATE_ROLE2_DESCRIPTION: "🆔 Which role would you like in the set?",
    ROLES_GROUPED_CREATE_SUCCESS: "✅ The grouped role set was created.",
    ROLES_GROUPED_DELETE_NAME: "delete",
    ROLES_GROUPED_DELETE_DESCRIPTION: "🗑️ Deletes a roleset.",
    ROLES_GROUPED_DELETE_NAME_NAME: "name",
    ROLES_GROUPED_DELETE_NAME_DESCRIPTION: "The name of the role set.",
    ROLES_GROUPED_DELETE_ROLE_NAME: "role",
    ROLES_GROUPED_DELETE_ROLE_DESCRIPTION: "🆔 Which role's roleset would you like to delete?",
    ROLES_GROUPED_DELETE_SUCCESS: "✅ The grouped role set was deleted. 🗑️",
    ROLES_GROUPED_NOT_FOUND: "⁉️ The grouped role set was not found.",
    ROLES_GROUPED_ADD_NAME: "add",
    ROLES_GROUPED_ADD_DESCRIPTION: "➕ Add another role to a role set.",
    ROLES_GROUPED_ADD_NAME_NAME: "name",
    ROLES_GROUPED_ADD_NAME_DESCRIPTION: "The name of the role set.",
    ROLES_GROUPED_ADD_ROLE_NAME: "role",
    ROLES_GROUPED_ADD_ROLE_DESCRIPTION: "🆔 Which role's roleset would you like to edit?",
    ROLES_GROUPED_ADD_ROLE2_NAME: "role2",
    ROLES_GROUPED_ADD_ROLE2_DESCRIPTION: "🆔 Which role would you like to add in the set?",
    ROLES_GROUPED_ADD_SUCCESS: "✅ The role has been added to the set.",
    ROLES_GROUPED_REMOVE_NAME: "remove",
    ROLES_GROUPED_REMOVE_DESCRIPTION: "➖ Remove a role to a role set.",
    ROLES_GROUPED_REMOVE_NAME_NAME: "name",
    ROLES_GROUPED_REMOVE_NAME_DESCRIPTION: "The name of role set.",
    ROLES_GROUPED_REMOVE_ROLE_NAME: "role",
    ROLES_GROUPED_REMOVE_ROLE_DESCRIPTION: "🆔 Which role's roleset would you like to edit?",
    ROLES_GROUPED_REMOVE_ROLE2_NAME: "role2",
    ROLES_GROUPED_REMOVE_ROLE2_DESCRIPTION: "🆔 Which role would you like to remove from the set?",
    ROLES_GROUPED_REMOVE_SUCCESS: "✅ The role has been removed from the set.",
    ROLES_GROUPED_LIST_NAME: "list",
    ROLES_GROUPED_LIST_DESCRIPTION: "🗒️ View the role sets on the server.",
    ROLES_GROUPED_LIST_NONE: "❌ There are no grouped role sets saved in the database for this server.",
    ROLES_GROUPED_LIST_TITLE: "List of Grouped Role Sets",
    ROLES_REQUIRED_NAME: "required",
    ROLES_REQUIRED_DESCRIPTION: "🛑 Stop a user from getting a role, if other roles are required to have this role.",
    ROLES_REQUIRED_CREATE_NAME: "create",
    ROLES_REQUIRED_CREATE_DESCRIPTION: "🆕 Creates a roleset.",
    ROLES_REQUIRED_CREATE_NAME_NAME: "name",
    ROLES_REQUIRED_CREATE_NAME_DESCRIPTION: "The name you want to set for this role set.",
    ROLES_REQUIRED_CREATE_ROLE_NAME: "role",
    ROLES_REQUIRED_CREATE_ROLE_DESCRIPTION: "🆔 Which role would you like to be watching for?",
    ROLES_REQUIRED_CREATE_ROLE2_NAME: "role2",
    ROLES_REQUIRED_CREATE_ROLE2_DESCRIPTION: "🆔 Which role would you like in the set?",
    ROLES_REQUIRED_CREATE_SUCCESS: "✅ The role set was created.",
    ROLES_REQUIRED_DELETE_NAME: "delete",
    ROLES_REQUIRED_DELETE_DESCRIPTION: "🗑️ Deletes a roleset.",
    ROLES_REQUIRED_DELETE_NAME_NAME: "name",
    ROLES_REQUIRED_DELETE_NAME_DESCRIPTION: "The name of the role set.",
    ROLES_REQUIRED_DELETE_ROLE_NAME: "role",
    ROLES_REQUIRED_DELETE_ROLE_DESCRIPTION: "🆔 Which role's roleset would you like to delete?",
    ROLES_REQUIRED_DELETE_SUCCESS: "✅ The role set was deleted. 🗑️",
    ROLES_REQUIRED_NOT_FOUND: "⁉️ The role set was not found.",
    ROLES_REQUIRED_ADD_NAME: "add",
    ROLES_REQUIRED_ADD_DESCRIPTION: "➕ Add another role to a role set.",
    ROLES_REQUIRED_ADD_NAME_NAME: "name",
    ROLES_REQUIRED_ADD_NAME_DESCRIPTION: "The name of the role set.",
    ROLES_REQUIRED_ADD_ROLE_NAME: "role",
    ROLES_REQUIRED_ADD_ROLE_DESCRIPTION: "🆔 Which role's roleset would you like to edit?",
    ROLES_REQUIRED_ADD_ROLE2_NAME: "role2",
    ROLES_REQUIRED_ADD_ROLE2_DESCRIPTION: "🆔 Which role would you like to add in the set?",
    ROLES_REQUIRED_ADD_SUCCESS: "✅ The role has been added to the set.",
    ROLES_REQUIRED_REMOVE_NAME: "remove",
    ROLES_REQUIRED_REMOVE_DESCRIPTION: "➖ Remove a role to a role set.",
    ROLES_REQUIRED_REMOVE_NAME_NAME: "name",
    ROLES_REQUIRED_REMOVE_NAME_DESCRIPTION: "The name of the role set.",
    ROLES_REQUIRED_REMOVE_ROLE_NAME: "role",
    ROLES_REQUIRED_REMOVE_ROLE_DESCRIPTION: "🆔 Which role's roleset would you like to edit?",
    ROLES_REQUIRED_REMOVE_ROLE2_NAME: "role2",
    ROLES_REQUIRED_REMOVE_ROLE2_DESCRIPTION: "🆔 Which role would you like to remove from the set?",
    ROLES_REQUIRED_REMOVE_SUCCESS: "✅ The role has been removed from the set.",
    ROLES_REQUIRED_LIST_NAME: "list",
    ROLES_REQUIRED_LIST_DESCRIPTION: "🗒️ View the role sets on the server.",
    ROLES_REQUIRED_LIST_NONE: "❌ There are no required role sets saved in the database for this server.",
    ROLES_REQUIRED_LIST_TITLE: "List of Required Role Sets",
    ROLES_DEFAULT_NAME: "default",
    ROLES_DEFAULT_DESCRIPTION: "🚥 Assign a user a role if they do not have any other role in the set.",
    ROLES_DEFAULT_CREATE_NAME: "create",
    ROLES_DEFAULT_CREATE_DESCRIPTION: "🆕 Creates a roleset.",
    ROLES_DEFAULT_CREATE_NAME_NAME: "name",
    ROLES_DEFAULT_CREATE_NAME_DESCRIPTION: "The name you want to set for this role set.",
    ROLES_DEFAULT_CREATE_ROLE_NAME: "role",
    ROLES_DEFAULT_CREATE_ROLE_DESCRIPTION: "🆔 Which role would you like to be watching for?",
    ROLES_DEFAULT_CREATE_ROLE2_NAME: "role2",
    ROLES_DEFAULT_CREATE_ROLE2_DESCRIPTION: "🆔 Which role would you like in the set?",
    ROLES_DEFAULT_CREATE_SUCCESS: "✅ The role set was created.",
    ROLES_DEFAULT_DELETE_NAME: "delete",
    ROLES_DEFAULT_DELETE_DESCRIPTION: "🗑️ Deletes a roleset.",
    ROLES_DEFAULT_DELETE_ROLE_NAME: "role",
    ROLES_DEFAULT_DELETE_ROLE_DESCRIPTION: "🆔 Which role's roleset would you like to delete?",
    ROLES_DEFAULT_DELETE_SUCCESS: "✅ The role set was deleted. 🗑️",
    ROLES_DEFAULT_NOT_FOUND: "⁉️ The role set was not found.",
    ROLES_DEFAULT_ADD_NAME: "add",
    ROLES_DEFAULT_ADD_DESCRIPTION: "➕ Add another role to a role set.",
    ROLES_DEFAULT_ADD_NAME_NAME: "name",
    ROLES_DEFAULT_ADD_NAME_DESCRIPTION: "The name of the role set.",
    ROLES_DEFAULT_ADD_ROLE_NAME: "role",
    ROLES_DEFAULT_ADD_ROLE_DESCRIPTION: "🆔 Which role's roleset would you like to edit?",
    ROLES_DEFAULT_ADD_ROLE2_NAME: "role2",
    ROLES_DEFAULT_ADD_ROLE2_DESCRIPTION: "🆔 Which role would you like to add in the set?",
    ROLES_DEFAULT_ADD_SUCCESS: "✅ The role has been added to the set.",
    ROLES_DEFAULT_REMOVE_NAME: "remove",
    ROLES_DEFAULT_REMOVE_DESCRIPTION: "➖ Remove a role from a role set.",
    ROLES_DEFAULT_REMOVE_NAME_NAME: "name",
    ROLES_DEFAULT_REMOVE_NAME_DESCRIPTION: "The name of the role set.",
    ROLES_DEFAULT_REMOVE_ROLE_NAME: "role",
    ROLES_DEFAULT_REMOVE_ROLE_DESCRIPTION: "🆔 Which role's roleset would you like to edit?",
    ROLES_DEFAULT_REMOVE_ROLE2_NAME: "role2",
    ROLES_DEFAULT_REMOVE_ROLE2_DESCRIPTION: "🆔 Which role would you like to remove from the set?",
    ROLES_DEFAULT_REMOVE_SUCCESS: "✅ The role has been removed from the set.",
    ROLES_DEFAULT_LIST_NAME: "list",
    ROLES_DEFAULT_LIST_DESCRIPTION: "🗒️ View the role sets on the server.",
    ROLES_DEFAULT_LIST_NONE: "❌ There are no default role sets saved in the database for this server.",
    ROLES_DEFAULT_LIST_TITLE: "List of Default Role Sets",
    ROLES_REACTIONS_NAME: "reactions",
    ROLES_REACTIONS_DESCRIPTION: "🔆 Allow users to manage roles by tapping on a button.",
    ROLES_REACTIONS_CREATE_NAME: "create",
    ROLES_REACTIONS_CREATE_DESCRIPTION: "🆕 Create a new reaction role.",
    ROLES_REACTIONS_CREATE_CHANNEL_NAME: "channel",
    ROLES_REACTIONS_CREATE_CHANNEL_DESCRIPTION: "🆔 Which channel is it in?",
    ROLES_REACTIONS_CREATE_MESSAGE_NAME: "message",
    ROLES_REACTIONS_CREATE_MESSAGE_DESCRIPTION: "🆔 What is the message id?",
    ROLES_REACTIONS_CREATE_EMOJI_NAME: "emoji",
    ROLES_REACTIONS_CREATE_EMOJI_DESCRIPTION: "🆔 What is the emoji you want to use?",
    ROLES_REACTIONS_CREATE_LABEL_NAME: "label",
    ROLES_REACTIONS_CREATE_LABEL_DESCRIPTION: "📓 What text would you like to display on this button?",
    ROLES_REACTIONS_CREATE_COLOR_NAME: "color",
    ROLES_REACTIONS_CREATE_COLOR_DESCRIPTION: "🟩 What color would you like to use for this button?",
    ROLES_REACTIONS_CREATE_COLOR_BLUE_NAME: "Blue",
    ROLES_REACTIONS_CREATE_COLOR_GREY_NAME: "Grey",
    ROLES_REACTIONS_CREATE_COLOR_GREEN_NAME: "Green",
    ROLES_REACTIONS_CREATE_COLOR_RED_NAME: "Red",
    ROLES_REACTIONS_CREATE_ROLE_NAME: "role",
    ROLES_REACTIONS_CREATE_ROLE_DESCRIPTION: "🆔 What is the role id you want to use for this?",
    ROLES_REACTIONS_CREATE_INVALID_MESSAGE_ID: (serverInviteCode: string) =>
        `❌ The message ID you provided does not seem to be a valid message id. Please try again. If you need help contact us at, https://discord.gg/${serverInviteCode}`,
    ROLES_REACTIONS_CREATE_PLACEHOLDER: `🖊️ This is a placeholder message you can edit to your liking.`,
    ROLES_REACTIONS_CREATE_PLACEHOLDER_EDIT: `🖊️ Use the buttons below to edit the message above. If you need help learning how to edit, press the button below.`,
    ROLES_REACTIONS_CREATE_EDIT: "Edit Text",
    ROLES_REACTIONS_CREATE_ADD: "Add Button",
    ROLES_REACTIONS_CREATE_REMOVE: "Remove Button",
    ROLES_REACTIONS_CREATE_SAVE: "Save",
    ROLES_REACTIONS_DELETE_NAME: "delete",
    ROLES_REACTIONS_DELETE_DESCRIPTION: "🗑️ Deletes a role reaction.",
    ROLES_REACTIONS_DELETE_MESSAGE_NAME: "message",
    ROLES_REACTIONS_DELETE_MESSAGE_DESCRIPTION: "🆔 What is the message id?",
    ROLES_REACTIONS_ADD_NAME: "add",
    ROLES_REACTIONS_ADD_DESCRIPTION: "➕ Add a button to the reaction role.",
    ROLES_REACTIONS_ADD_INVALID_MESSAGE: "❌ The message id you provided was not a valid id.",
    ROLES_REACTIONS_ADD_MESSAGE_UNKNOWN: "❌ The message id you provided could not be found.",
    ROLES_REACTIONS_ADD_MESSAGE_USER: "❌ The message you selected was not sent by me. I can only use buttons on message sent by me.",
    ROLES_REACTIONS_ADD_CHANNEL_NAME: "channel",
    ROLES_REACTIONS_ADD_CHANNEL_DESCRIPTION: "🆔 Which channel is it in?",
    ROLES_REACTIONS_ADD_MESSAGE_NAME: "message",
    ROLES_REACTIONS_ADD_MESSAGE_DESCRIPTION: "🆔 What is the message id?",
    ROLES_REACTIONS_ADD_EMOJI_NAME: "emoji",
    ROLES_REACTIONS_ADD_EMOJI_DESCRIPTION: "🆔 What is the emoji you want to use?",
    ROLES_REACTIONS_ADD_LABEL_NAME: "label",
    ROLES_REACTIONS_ADD_LABEL_DESCRIPTION: "📓 What text would you like to display on this button?",
    ROLES_REACTIONS_ADD_COLOR_NAME: "color",
    ROLES_REACTIONS_ADD_COLOR_DESCRIPTION: "🟩 What color would you like to use for this button?",
    ROLES_REACTIONS_ADD_COLOR_BLUE_NAME: "Blue",
    ROLES_REACTIONS_ADD_COLOR_GREY_NAME: "Grey",
    ROLES_REACTIONS_ADD_COLOR_GREEN_NAME: "Green",
    ROLES_REACTIONS_ADD_COLOR_RED_NAME: "Red",
    ROLES_REACTIONS_ADD_ROLE_NAME: "role",
    ROLES_REACTIONS_ADD_ROLE_DESCRIPTION: "🆔 What is the role id you want to use for this?",
    ROLES_REACTIONS_REMOVE_NAME: "remove",
    ROLES_REACTIONS_REMOVE_DESCRIPTION: "➖ Remove a button.",
    ROLES_REACTIONS_REMOVE_CHANNEL_NAME: "channel",
    ROLES_REACTIONS_REMOVE_CHANNEL_DESCRIPTION: "🆔 Which channel is it in?",
    ROLES_REACTIONS_REMOVE_MESSAGE_NAME: "message",
    ROLES_REACTIONS_REMOVE_MESSAGE_DESCRIPTION: "🆔 What is the message id?",
    ROLES_REACTIONS_REMOVE_EMOJI_NAME: "emoji",
    ROLES_REACTIONS_REMOVE_EMOJI_DESCRIPTION: "🆔 What is the emoji you want to use?",
    ROLES_REACTIONS_REMOVE_LABEL_NAME: "label",
    ROLES_REACTIONS_REMOVE_LABEL_DESCRIPTION: "📓 What text would you like to display on this button?",
    ROLES_REACTIONS_REMOVE_COLOR_NAME: "color",
    ROLES_REACTIONS_REMOVE_COLOR_DESCRIPTION: "🟩 What color would you like to use for this button?",
    ROLES_REACTIONS_REMOVE_ROLE_NAME: "role",
    ROLES_REACTIONS_REMOVE_ROLE_DESCRIPTION: "🆔 What is the role id you want to use for this?",
    ROLES_REACTIONS_COLORS_NAME: "colors",
    ROLES_REACTIONS_COLORS_DESCRIPTION: "⚙️ Create a color wheel.",
    ROLES_REACTIONS_COLORS_CONFIRM: "🖊️ Are you sure you want to create the color wheel? This will create a lot of color based roles on your server.",
    ROLES_REACTIONS_PRONOUNS_CONFIRM: "🖊️ Are you sure you want to create the pronoun selector? This will create a few roles on your server.",
    REACTION_ROLE_COLOR_GUILD_UNKNOWN: "❌ The guild was unable to be found.",
    REACTION_ROLE_COLOR_MAX_ROLES: "❌ There are too many roles on the server, I am unable to create more roles.",
    REACTION_ROLE_COLOR_EXISTS: "❌ A color wheel already appears to exist on the server.",
    REACTION_ROLE_COLORS_COLOR_WHEEL: "The Wheel Of Color",
    REACTION_ROLE_COLORS_PICK_COLOR:
        "Tired of boring, drab white or black? Want to add a little color into your life? Look no further than Gamer's very own color picker. Simply find the color below you wish to make your name and click it. It's that simple! Tired of your new color? Just pick a new one and you're good to go!",
    REACTION_ROLE_COLORS_DONT_FORGET: "Don't Forget",
    REACTION_ROLE_COLORS_ONLY_ONE:
        "You can only have one color at a time. We don't have the technology (yet!) to mix two colors together. When you click a different color it will remove the first color from your name so don't worry about accumulating too many color roles.",
    REACTION_ROLE_COLOR_LOADING: "⏱️ Please hold on, this may take a bit of time. Loading...",
    CONFIRM: "Confirm",
    ROLES_REACTIONS_PRONOUNS_NAME: "pronouns",
    ROLES_REACTIONS_PRONOUNS_DESCRIPTION: "⚙️ Create a Pronoun selector.",
    REACTION_ROLE_PRONOUN_SELECTOR: "Pronoun Selector",
    ROLES_REACTIONS_MODAL_TITLE_EMOJI: "Emoji",
    ROLES_REACTIONS_MODAL_TITLE_EMOJI_PLACEHOLDER: "Emoji in the form of <emojiname:id> or 😄",
    ROLES_REACTIONS_MODAL_TITLE_COLOR: "Button Color",
    ROLES_REACTIONS_MODAL_TITLE_COLOR_PLACEHOLDER: "Red Blue Green Grey",
    ROLES_REACTIONS_MODAL_TITLE_ROLE: "Role",
    ROLES_REACTIONS_MODAL_TITLE_ROLE_PLACEHOLDER: "The role you wish to give.",
    ROLES_REACTIONS_MODAL_TITLE_LABEL: "Label",
    ROLES_REACTIONS_MODAL_TITLE_LABEL_PLACEHOLDER: "The name of the button",
    ROLES_REACTIONS_MODAL_TITLE_TEXT: "Text or JSON Embed Code",
    ROLES_REACTIONS_MODAL_TITLE_TEXT_PLACEHOLDER: "The text or embed code here",
    ROLES_REACTIONS_MODAL_UNKNOWN_MESSAGE: "❌ The message this modal was created for was unable to be fetched.",
    ROLES_REACTIONS_MODAL_MESSAGE_NO_BUTTONS: "❌ The message this modal was created for does not have any buttons on it.",
    ROLES_REACTIONS_MODAL_INVALID_EMOJI: "❌ The emoji you provided was not a valid emoji.",
    ROLES_REACTIONS_MODAL_INVALID_ROLE: "❌ The role id you provided was not valid id.",
    ROLES_REACTIONS_MODAL_ROLE_USED: "❌ This role has already been assigned to another button.",
    REACTION_ROLE_GRANTED: "The user was given a role because they pressed a reaction role button.",
    REACTION_ROLE_TAKEN: "The user's role was taken because they pressed a reaction role button.",
    REACTION_ROLE_ADDED: "➕ You have been given the role.",
    REACTION_ROLE_REMOVED: "➖ You have lost the role.",
    REACTION_ROLE_SAVED: "✅ The reaction role has been saved. In order to edit this in the future, you must use the `/roles reactions` command.",
    REACTION_ROLE_EDITED: "✅ The reaction role has been successfully edited.",
    INVALID_EMBED_JSON_CODE: (serverInviteCode: string) =>
        `❌ The embed code you provided was not valid JSON. Need help? Join https://discord.gg/${serverInviteCode}`,
    SEND_MESSAGE_ERROR: "❌ The message was not able to be sent. Cancelling.",
    VIP_NAME: "vip",
    VIP_DESCRIPTION: "⭐ Enable VIP features on your server.",
    VIP_SUCCESS: "✅ Your server has VIP features enabled. Thank you for supporting Gamer Bot!",
    INVALID_HEX_COLOR: "❌ The hex color you provided was not a valid hex color. A hex color looks something like: `#00FFFF`",
    INVALID_URL: "❌ The url you provided was not valid.",
    INVALID_IMAGE_URL: "❌ The url you provided was not a valid image url.",

    SERVER_PREFIX: (prefix: string) => [
        `<:info:443803045382324225> The prefix for this server is: \`${prefix}\``,
        "<:g4m3rhappy:458758780121776139> Type **.help** to get started.",
    ],
};

export default english;

export type TranslationKeys = keyof typeof english;
export type TranslationKeysForArrays = KeysMatching<typeof english, any[]>;
