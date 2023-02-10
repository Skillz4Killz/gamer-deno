import { ActionFunction, LoaderFunction, MetaFunction } from "@remix-run/node";
import { destroySession } from "~/utils/session.server";

export const meta: MetaFunction = () => {
    return {
        title: "Komi | Logout",
        description: "Logout from the website!",
    };
};

export const action: ActionFunction = async ({ request }) => {
    const form = await request.formData();
    const redirectTo = form.get("redirectTo");
    return destroySession(request, typeof redirectTo === "string" ? redirectTo : "/");
};

export const loader: LoaderFunction = async ({ request }) => {
    return destroySession(request, "/");
};
