export interface Constants {
  counting: {
    shop: { id: number; type: "buff" | "debuff"; name: string; cost: number }[];
  };
  modlogs: {
    colors: {
      kick: string;
      ban: string;
      unban: string;
      warn: string;
      mute: string;
      unmute: string;
    };
    images: {
      kick: string;
      ban: string;
      unban: string;
      warn: string;
      mute: string;
      unmute: string;
    };
  };
  personalities: {
    id: string;
    name: string;
    names: string[];
  }[];
  milliseconds: {
    WEEK: number;
    DAY: number;
    HOUR: number;
    MINUTE: number;
    SECOND: number;
  };
  botSupportInvite: string;
  botInviteLink: string;
  botSupportServerID: string;
  emojis: {
    boosts: string;
    bot: string;
    coin: string;
    failure: string;
    gamer: {
      hug: string;
      ban: string;
      warn: string;
      star: string;
    };
    numbers: string[];
    quit: string;
    success: string;
    todo: {
      current: "📌";
      next: "⏩";
      backlog: "🔖";
      completed: "✅";
      archived: "📥";
      delete: "🗑️";
    };
    voteup: string;
    votedown: string;
    mailbox: string;
  };
}
