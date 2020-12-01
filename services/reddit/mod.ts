import { executeWebhook } from "./deps.ts";
import { db } from "../../src/database/database.ts";
import { Embed } from "../../src/utils/Embed.ts";

async function fetchLatestRedditPosts(name: string) {
  // Remove the r/ if the user used this
  if (name.startsWith("r/")) name = name.substring(2);
  // Fetch the rss data
  const data = await fetch(`https://reddit.com/r/${name}/new/.json`).then(
    (res) => res.json(),
  ).catch(console.error);
  if (!data) {
    console.error("fetch returned nothing");
    return [];
  }

  return data.data.children.map((c: { data: any }) => c.data);
}

const recent = new Map<string, string[]>();

async function processRedditSubscriptions() {
  console.log("Processing Reddit Subscriptions");

  const redditSubs = await db.reddit.findMany({}, true);

  for (const redditSub of redditSubs) {
    console.log(`Reddit Subs: ${redditSub.id}`);

    const posts = await fetchLatestRedditPosts(redditSub.id);
    // console.log(posts);
    console.log(`[Reddit]: ${redditSub.id} ${posts.length} posts fetched.`);
    if (!posts.length) continue;

    redditSub.subscriptions.forEach((sub) => {
      for (const post of posts.reverse()) {
        // If there is a filter and the title does not have the filter
        if (
          sub.filter &&
          !post.title.toLowerCase().split(" ").includes(sub.filter) &&
          !post.selftext.toLowerCase().split(" ").includes(sub.filter)
        ) {
          continue;
        }

        if (recent.get(redditSub.id)?.includes(post.permalink)) continue;

        const embed = new Embed()
          .setTitle(
            post.title || "Unknown Title",
            `https://www.reddit.com${post.permalink}`,
          )
          .setAuthor(
            redditSub.id,
            "https://i.imgur.com/6UiQy32.jpg",
          )
          .addField(
            "🗣️",
            `[${post.author}](https://reddit.com/user/${post.author})`,
          )
          .setTimestamp(Date.now());

        if (post.selftext) embed.setDescription(post.selftext);
        if (post.post_hint === "image") embed.setImage(post.url);
        else if (post.is_video && post.url) {
          embed.setDescription(`📹 ${post.url}`);
          embed.setImage(post.preview?.images?.source?.url);
        }
        if (post.post_hint === "link") {
          embed.setDescription(post.title)
            .setTitle(post.url, post.url)
            .setImage(post.preview?.images?.source?.url);
        }

        executeWebhook(sub.webhookID, sub.webhookToken, {
          content: sub.text,
          embeds: [embed],
        })
          .catch((error) => {
            console.error("Reddit Embed Sending Error:", error);
            console.error("Reddit Embed Sending Error 2:", embed);
          });
      }
    });

    recent.set(redditSub.id, posts.map((p) => p.permalink));
  }

  setTimeout(() => processRedditSubscriptions(), 60000 * 3);
}

processRedditSubscriptions();
