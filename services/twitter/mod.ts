import { executeWebhook } from "./deps.ts";
import { db } from "../../src/database/database.ts";
import { Embed } from "../../src/utils/Embed.ts";
import parse from "https://denopkg.com/nekobato/deno-xml-parser/index.ts";

async function fetchTweets(name: string) {
  const data = await fetch(`https://twitter.com/${name}`, { headers: {'user-agent':'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/37.0.2062.120 Safari/537.36'} }).then(
    (res) => res.text()
  ).catch(console.error);
  if (!data) {
    console.error("fetch returned nothing");
    return [];
  }

  console.log('x', parse(data));
  // return data.data.children.map((c: { data: any }) => c.data);
}

fetchTweets("POTUS");

// const recent = new Map<string, string[]>();

// async function processRedditSubscriptions() {
//   console.log("Processing Reddit Subscriptions");

//   const redditSubs = await db.reddit.findMany({}, true);

//   for (const redditSub of redditSubs) {
//     console.log(`Reddit Subs: ${redditSub.id}`);

//     const posts = await fetchLatestRedditPosts(redditSub.id);
//     // console.log(posts);
//     console.log(`[Reddit]: ${redditSub.id} ${posts.length} posts fetched.`);
//     if (!posts.length) continue;

//     redditSub.subscriptions.forEach((sub) => {
//       for (const post of posts.reverse()) {
//         // If there is a filter and the title does not have the filter
//         if (
//           sub.filter &&
//           !post.title.toLowerCase().split(" ").includes(sub.filter) &&
//           !post.selftext.toLowerCase().split(" ").includes(sub.filter)
//         ) {
//           continue;
//         }

//         if (recent.get(redditSub.id)?.includes(post.permalink)) continue;

//         const embed = new Embed()
//           .setTitle(
//             post.title || "Unknown Title",
//             `https://www.reddit.com${post.permalink}`,
//           )
//           .setAuthor(
//             redditSub.id,
//             "https://i.imgur.com/6UiQy32.jpg",
//           )
//           .addField(
//             "🗣️",
//             `[${post.author}](https://reddit.com/user/${post.author})`,
//           )
//           .setTimestamp(Date.now());

//         if (post.selftext) embed.setDescription(post.selftext);
//         if (post.post_hint === "image") embed.setImage(post.url);
//         else if (post.is_video && post.url) {
//           embed.setDescription(`📹 ${post.url}`);
//           embed.setImage(post.preview?.images?.source?.url);
//         }
//         if (post.post_hint === "link") {
//           embed.setDescription(post.title)
//             .setTitle(post.url, post.url)
//             .setImage(post.preview?.images?.source?.url);
//         }

//         executeWebhook(sub.webhookID, sub.webhookToken, {
//           content: sub.text,
//           embeds: [embed],
//         })
//           .catch((error) => {
//             console.error("Reddit Embed Sending Error:", error);
//             console.error("Reddit Embed Sending Error 2:", embed);
//           });
//       }
//     });

//     recent.set(redditSub.id, posts.map((p) => p.permalink));
//   }

//   setTimeout(() => processRedditSubscriptions(), 60000 * 3);
// }

// processRedditSubscriptions();
