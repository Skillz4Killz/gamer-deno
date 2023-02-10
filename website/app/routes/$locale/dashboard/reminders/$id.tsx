import { ActionFunction, json, LoaderFunction, redirect } from "@remix-run/node";
import { Form, useActionData, useLoaderData } from "@remix-run/react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import prisma from "~/utils/db.server";
import { guildIconUrl } from "~/utils/imageUrl";
import { getGuilds } from "~/utils/oauth.server";
import { requireData, SessionData } from "~/utils/session.server";

type LoaderData = {
    user: SessionData;
    settings?: { imageURL?: string | null; serverName?: string; interval: number | null; content: string } | undefined;
    id: string;
};
export const loader: LoaderFunction = async ({ request, params }): Promise<LoaderData> => {
    const user = await requireData(request);

    const reminder = await prisma.reminders.findFirst({
        where: { id: Number(params.id)!, user_id: BigInt(user.userId) },
    });

    if (!reminder) return { user, id: params.id! };

    const guilds = await getGuilds(user.accessToken);
    const server = guilds.find((g) => g.id === reminder?.server_id.toString());

    return {
        user,
        settings: reminder
            ? {
                  content: reminder.content,
                  interval: reminder.interval,
                  imageURL: server ? guildIconUrl(server) : undefined,
                  serverName: server?.name,
              }
            : undefined,
        id: params.id!,
    };
};

function getFormItem(form: FormData, name: string) {
    const item = form.get(name);
    if (item === null) return;

    return item.toString();
}

type ActionData =
    | {
          content?: string;
          years?: string;
          months?: string;
          weeks?: string;
          days?: string;
          hours?: string;
          minutes?: string;
          seconds?: string;
      }
    | undefined;
export const action: ActionFunction = async ({ request, params }) => {
    const form = await request.formData();
    const user = await requireData(request);

    const changes: Record<string, unknown> = {};
    const errors: Record<string, string> = {
        content: "",
        interval: "",
        years: "",
        months: "",
        weeks: "",
        days: "",
        hours: "",
        minutes: "",
        seconds: "",
    };

    const content = getFormItem(form, "content");
    if (content) {
        if (content.length > 500 || content.length < 1) {
            errors.content += "Must be between 1-500 characters.";
        }

        changes.content = content;
    }

    const years = getFormItem(form, "years");
    const months = getFormItem(form, "months");
    const weeks = getFormItem(form, "weeks");
    const days = getFormItem(form, "days");
    const hours = getFormItem(form, "hours");
    const minutes = getFormItem(form, "minutes");

    let interval = 0;
    if (years) interval += Milliseconds.Year * Number(years);
    if (months) interval += Milliseconds.Month * Number(months);
    if (weeks) interval += Milliseconds.Week * Number(weeks);
    if (days) interval += Milliseconds.Day * Number(days);
    if (hours) interval += Milliseconds.Hour * Number(hours);
    if (minutes) interval += Milliseconds.Minute * Number(minutes);

    if (interval) changes.interval = interval / 1000;
    else changes.interval = null;

    const hasErrors = Object.values(errors).some((errorMessage) => errorMessage);
    if (hasErrors) {
        return json<ActionData>(errors);
    }

    await prisma.reminders.updateMany({
        where: { id: Number(params.id!), user_id: BigInt(user.userId) },
        data: changes,
    });
    return redirect("/dashboard");
};

export default function ReminderEdit() {
    const data = useLoaderData<LoaderData>();
    const errors = useActionData<ActionData>();
    const [editReminder, setEditReminder] = useState(false);
    const [allowInterval, setAllowInterval] = useState(false);
    const [modifiedInterval, setModifiedInterval] = useState(false);

    if (!modifiedInterval && !allowInterval && data.settings?.interval) {
        setAllowInterval(true);
    }

    const { t } = useTranslation();

    if (!data.settings) {
        return (
            <div>
                <p>There was no reminder found for your account, with the ID ({data.id})</p>
            </div>
        );
    }

    const intervals = data.settings.interval ? millisecondsIntervals(data.settings.interval * 1000) : undefined;

    return (
        <div>
            <div className="drawer drawer-mobile">
                <div className="mt-4">
                    <Form
                        method="post"
                        onChange={() => {
                            setEditReminder(true);
                        }}
                        onReset={() => {
                            setModifiedInterval(false);
                            setAllowInterval(false);
                            setEditReminder(false);
                        }}
                        onSubmit={() => {
                            setEditReminder(false);
                            setModifiedInterval(false);
                            setAllowInterval(false);
                        }}
                    >
                        <div className="flex flex-wrap items-center justify-center">
                            <div className="card w-96 bg-base-100 shadow-xl mr-2">
                                <div className="card-body">
                                    <h2 className="card-title">Reminder Text</h2>
                                    {errors?.content ? <em className="text-red-600">{errors.content}</em> : null}
                                    <textarea
                                        className="textarea textarea-bordered"
                                        defaultValue={data.settings.content}
                                        name="content"
                                        maxLength={500}
                                        minLength={1}
                                    ></textarea>
                                </div>
                            </div>

                            <div className="card bg-base-100 shadow-xl">
                                <div className="card-body">
                                    <div className="flex items-center">
                                        <h2 className="card-title mr-3 pr-3">Repeat Reminder</h2>
                                        <input
                                            type="checkbox"
                                            className="toggle toggle-success"
                                            checked={allowInterval}
                                            name="interval"
                                            onChange={(v) => {
                                                setModifiedInterval(true);
                                                setAllowInterval(!allowInterval);
                                            }}
                                        />
                                    </div>
                                    {errors?.years ? <em className="text-red-600">{errors.years}</em> : null}
                                    {errors?.months ? <em className="text-red-600">{errors.months}</em> : null}
                                    {errors?.weeks ? <em className="text-red-600">{errors.weeks}</em> : null}
                                    {errors?.days ? <em className="text-red-600">{errors.days}</em> : null}
                                    {errors?.hours ? <em className="text-red-600">{errors.hours}</em> : null}
                                    {errors?.minutes ? <em className="text-red-600">{errors.minutes}</em> : null}

                                    {allowInterval ? (
                                        <div className="flex justify-center">
                                            <div className="form-control mr-1">
                                                <label className="input-group">
                                                    <input
                                                        defaultValue={intervals?.years ?? 0}
                                                        className="input input-bordered"
                                                        name="years"
                                                        type="number"
                                                        max={2}
                                                        min={0}
                                                    />
                                                    <span>years</span>
                                                </label>
                                            </div>

                                            <div className="form-control mr-1">
                                                <label className="input-group">
                                                    <input
                                                        defaultValue={intervals?.months ?? 0}
                                                        className="input input-bordered"
                                                        name="months"
                                                        type="number"
                                                        max={11}
                                                        min={0}
                                                    />
                                                    <span>months</span>
                                                </label>
                                            </div>

                                            <div className="form-control mr-1">
                                                <label className="input-group">
                                                    <input
                                                        defaultValue={intervals?.weeks ?? 0}
                                                        className="input input-bordered"
                                                        name="weeks"
                                                        type="number"
                                                        max={3}
                                                        min={0}
                                                    />
                                                    <span>weeks</span>
                                                </label>
                                            </div>

                                            <div className="form-control mr-1">
                                                <label className="input-group">
                                                    <input
                                                        defaultValue={intervals?.days ?? 0}
                                                        className="input input-bordered"
                                                        name="days"
                                                        type="number"
                                                        max={6}
                                                        min={0}
                                                    />
                                                    <span>days</span>
                                                </label>
                                            </div>

                                            <div className="form-control mr-1">
                                                <label className="input-group">
                                                    <input
                                                        defaultValue={intervals?.hours ?? 0}
                                                        className="input input-bordered"
                                                        name="hours"
                                                        type="number"
                                                        max={23}
                                                        min={0}
                                                    />
                                                    <span>hours</span>
                                                </label>
                                            </div>

                                            <div className="form-control">
                                                <label className="input-group">
                                                    <input
                                                        defaultValue={intervals?.minutes ?? 10}
                                                        className="input input-bordered"
                                                        name="minutes"
                                                        type="number"
                                                        max={59}
                                                        min={10}
                                                    />
                                                    <span>minutes</span>
                                                </label>
                                            </div>
                                        </div>
                                    ) : null}
                                </div>
                            </div>
                        </div>

                        {editReminder ? (
                            <div className="alert shadow-lg alert-success fixed bottom-0 max-w-max mb-2 flex">
                                <div>
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        className="stroke-primary flex-shrink-0 w-6 h-6"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                        ></path>
                                    </svg>
                                    <span>Would you like to save all the changes to your settings?</span>
                                </div>
                                <div className="flex-none">
                                    <button type="reset" className="btn btn-outline btn-error btn-sm">
                                        Reset
                                    </button>

                                    <button type="submit" className="btn btn-primary btn-sm">
                                        Save
                                    </button>
                                </div>
                                <p></p>
                            </div>
                        ) : null}
                    </Form>
                </div>
            </div>
        </div>
    );
}

export enum Milliseconds {
    Second = 1000,
    Minute = 1000 * 60,
    Hour = 1000 * 60 * 60,
    Day = 1000 * 60 * 60 * 24,
    Week = 1000 * 60 * 60 * 24 * 7,
    Month = 1000 * 60 * 60 * 24 * 30,
    Year = 1000 * 60 * 60 * 24 * 365,
}

/** This function should be used when you want to convert milliseconds to a human readable format like 1d5h. */
export function millisecondsIntervals(milliseconds: number) {
    const years = Math.floor(milliseconds / Milliseconds.Year);
    const months = Math.floor((milliseconds % Milliseconds.Year) / Milliseconds.Month);
    const weeks = Math.floor(((milliseconds % Milliseconds.Year) % Milliseconds.Month) / Milliseconds.Week);
    const days = Math.floor(
        (((milliseconds % Milliseconds.Year) % Milliseconds.Month) % Milliseconds.Week) / Milliseconds.Day,
    );
    const hours = Math.floor(
        ((((milliseconds % Milliseconds.Year) % Milliseconds.Month) % Milliseconds.Week) % Milliseconds.Day) /
            Milliseconds.Hour,
    );
    const minutes = Math.floor(
        (((((milliseconds % Milliseconds.Year) % Milliseconds.Month) % Milliseconds.Week) % Milliseconds.Day) %
            Milliseconds.Hour) /
            Milliseconds.Minute,
    );
    const seconds = Math.floor(
        ((((((milliseconds % Milliseconds.Year) % Milliseconds.Month) % Milliseconds.Week) % Milliseconds.Day) %
            Milliseconds.Hour) %
            Milliseconds.Minute) /
            Milliseconds.Second,
    );

    return {
        years,
        months,
        weeks,
        days,
        hours,
        minutes,
        seconds,
    };
}
