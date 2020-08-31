export interface Constants {
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
  emojis: {
    boosts: string;
    coin: string;
    bot: string;
    success: string;
    todo: {
      current: "📌";
      next: "⏩";
      backlog: "🔖";
      completed: "✅";
      archived: "📥";
      delete: "🗑️";
    };
  };
}
