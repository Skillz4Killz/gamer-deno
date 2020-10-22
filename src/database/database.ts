import { Sabr, SabrTable } from "../../deps.ts";
import {
  AnalyticSchema,
  ClientSchema,
  CountingSchema,
  DefaultRoleSetsSchema,
  EmojiSchema,
  FeedbackSchema,
  GuildSchema,
  ItemSchema,
  LabelSchema,
  MailSchema,
  MirrorSchema,
  ModlogSchema,
  ReminderSchema,
  RequiredRoleSetsSchema,
  SurveySchema,
  TagSchema,
  UniqueRoleSetsSchema,
  UserSchema,
} from "./schemas.ts";

// Create the database class
const sabr = new Sabr();

export const db = {
  // This will allow us to access table methods easily as we will see below.
  sabr,
  analytics: new SabrTable<AnalyticSchema>(sabr, "analytics"),
  client: new SabrTable<ClientSchema>(sabr, "client"),
  counting: new SabrTable<CountingSchema>(sabr, "counting"),
  defaultrolesets: new SabrTable<DefaultRoleSetsSchema>(
    sabr,
    "defaultrolesets",
  ),
  emojis: new SabrTable<EmojiSchema>(sabr, "emojis"),
  feedbacks: new SabrTable<FeedbackSchema>(sabr, "feedbacks"),
  guilds: new SabrTable<GuildSchema>(sabr, "guilds"),
  items: new SabrTable<ItemSchema>(sabr, "items"),
  labels: new SabrTable<LabelSchema>(sabr, "labels"),
  mails: new SabrTable<MailSchema>(sabr, "mails"),
  mirrors: new SabrTable<MirrorSchema>(sabr, "mirrors"),
  modlogs: new SabrTable<ModlogSchema>(sabr, "modlogs"),
  reminders: new SabrTable<ReminderSchema>(sabr, "reminders"),
  requiredrolesets: new SabrTable<RequiredRoleSetsSchema>(
    sabr,
    "requiredrolesets",
  ),
  surveys: new SabrTable<SurveySchema>(sabr, "surveys"),
  tags: new SabrTable<TagSchema>(sabr, "tags"),
  uniquerolesets: new SabrTable<UniqueRoleSetsSchema>(sabr, "uniquerolesets"),
  users: new SabrTable<UserSchema>(sabr, "users"),
};

// This is important as it prepares all the tables.
await sabr.init();
