import { BitwisePermissionFlags, PermissionStrings } from "@discordeno/bot";
import { Platforms } from "../../base/typings.js";

/** Checks if the given permission bits are matching the given permissions. `ADMINISTRATOR` always returns `true` */
export function validatePermissions(permissionBits: bigint, permissions: PermissionStrings[], options: { platform: Platforms }) {
    if (options.platform === Platforms.Discord) {
        if (permissionBits & 8n) return true;

        return permissions.every(
            (permission) =>
                // Check if permission is in permissionBits
                permissionBits & BigInt(BitwisePermissionFlags[permission]),
        );
    }

    // TODO: permissions - Guilded permissions handling
    return true;
}
