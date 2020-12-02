import { executeWebhook } from "./deps.ts";
import { db } from "./database.ts";

async function fetchTweets(name: string) {
  const data = await fetch(
    `https://twitter.com/${name}`,
    {
      headers: {
        "user-agent":
          "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/37.0.2062.120 Safari/537.36",
      },
    },
  ).then(
    (res) => res.text(),
  ).catch(console.error);
  if (!data) {
    console.error("fetch returned nothing");
    return [];
  }

  return [
    ...new Set(
      data.split(" ").filter((word) =>
        word.startsWith('href="/') && word.includes("status/") &&
        !word.includes("/actions") && !word.startsWith("status")
      ).map((word) =>
        `https://twitter.com${word.substring(6, word.lastIndexOf('"') - 4)}`
      ),
    ),
  ];
}

// In the first time this starts we don't post every single tweet again.
let allowPosts = false;
const recent = new Map<string, string[]>();

async function processTwitterSubscriptions() {
  console.log("Processing Twitter Subscriptions");

  const twitterSubs = await db.twitter.findMany({}, true);

  for (const twitterSub of twitterSubs) {
    console.log(`Twitter Subs: ${twitterSub.id}`);

    const posts = await fetchTweets(twitterSub.id);
    // console.log(posts);
    console.log(`[Twitter]: ${twitterSub.id} ${posts.length} posts fetched.`);
    if (!posts.length) continue;

    twitterSub.subscriptions.forEach((sub) => {
      for (const post of posts.reverse()) {
        // If there is a filter and the title does not have the filter
        if (sub.filter && !post.includes(sub.filter)) continue;

        if (recent.get(twitterSub.id)?.includes(post)) continue;

        executeWebhook(sub.webhookID, sub.webhookToken, {
          content: `${sub.text} ${post}`.trim(),
        })
          .catch((error) => {
            console.error("Twitter Embed Sending Error:", error);
            console.error("Twitter Embed Sending Error 2:", post);
          });
      }
    });

    recent.set(twitterSub.id, posts);
  }

  if (!allowPosts) allowPosts = true;
  setTimeout(() => processTwitterSubscriptions(), 60000 * 3);
}

processTwitterSubscriptions();
