import { EventHandlers, Member, Guild, UserPayload } from "../../deps.ts";

// This interface is a placeholder that allows you to easily add on custom events for your need.
// deno-lint-ignore no-empty-interface
export interface CustomEvents extends EventHandlers {
  memberAdd: (guild: Guild, user: UserPayload, member?: Member) => unknown;
  memberRemove: (guild: Guild, user: UserPayload, member?: Member) => unknown;
}
