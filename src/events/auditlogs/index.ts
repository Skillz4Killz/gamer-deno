import { AuditLogEvents, EventHandlers } from "@discordeno/bot";
import { handleMemberRoleUpdate } from "./roles.js";

export const auditLogEntryCreate: EventHandlers["auditLogEntryCreate"] = async function (payload) {
    switch (payload.actionType) {
        case AuditLogEvents.MemberRoleUpdate:
            return await handleMemberRoleUpdate(payload);
    }
};
