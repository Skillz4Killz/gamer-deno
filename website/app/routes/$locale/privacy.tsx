import { Image } from "remix-image";
import Layout from "~/components/Layout";
import { SUPPORT_SERVER } from "~/utils/constants";
import Logo from "../../../public/images/logo.webp";

export default function Terms() {
    return (
        <Layout>
            <div className="hero min-h-screen mb-0 pb-0">
                <div className="mb-4 md:mb-0 w-full max-w-screen-md mx-auto relative h-96">
                    <div
                        className="absolute left-0 bottom-0 w-full h-full z-10"
                        style={{ backgroundImage: "linear-gradient(180deg,transparent,rgba(0,0,0,.7))" }}
                    ></div>
                    <Image
                        src="https://c.tenor.com/tCT2oAZHaOYAAAAC/stargate-sg1.gif"
                        className="absolute left-0 top-0 w-full h-full z-0"
                    />
                    <div className="p-4 absolute bottom-0 left-0 z-20">
                        <a
                            href="#"
                            className="px-4 py-1 bg-primary rounded text-gray-200 inline-flex items-center justify-center mb-2"
                        >
                            Legal
                        </a>
                        <h2 className="text-4xl font-semibold text-gray-100 leading-tight">Privacy Policy</h2>
                        <div className="flex mt-3">
                            <Image src={Logo} className="h-10 w-10 rounded-full mr-2 object-cover" />
                            <div>
                                <p className="font-semibold text-gray-200 text-sm"> Gamer Team </p>
                                <p className="font-semibold text-gray-400 text-xs"> Last Updated: January 1st, 2020 </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-screen-xl mx-auto">
                <div className="">
                    <div className="px-4 lg:px-0 mt-12 text-info max-w-screen-md mx-auto text-lg leading-relaxed">
                        <p className="pb-6">
                            This privacy policy that you agree to and accept when adding any of our "Gamer" bots to your
                            server, or as a member of any server in which Gamer bots are on. "Gamer" bots refer to bots
                            created and hosted by us at{" "}
                            <a href={SUPPORT_SERVER} className="text-warning">
                                {SUPPORT_SERVER}
                            </a>
                            {". "}
                            The code may be public and therefore anyone can host their own version. Those are not
                            "Gamer" bots! This privacy policy applies to all of the following applications but not
                            limited to:
                        </p>
                        <ol className="pb-6">
                            <li>- Gamer#5758</li>
                            <li>- Gamer-Beta#4271</li>
                            <li>- Gamer-Canary#4383</li>
                            <li>- VIP-1#3480</li>
                        </ol>
                        <h2 className="text-2xl text-primary font-semibold mb-4 mt-4 capitalize">
                            What data do the bots collect?
                        </h2>
                        <p className="pb-6">
                            <p className="pb-2">
                                The only data we will ever save are the settings commands that you will choose to save.
                            </p>
                            <p className="pb-2">
                                Majority of the settings are usually either just toggles of on or off, they can be id
                                like channel ids, role ids or user ids. Very few settings will ever save data. Certain
                                other commands will also save information, for example, the events, afk commands save
                                your message you want saved.
                            </p>
                            <p className="pb-2">
                                We do not store any content without your express permission except certain command
                                actions. When a trigger such as a command is done on the bot, the bot will log the
                                username#discriminator, user id, server name, server id, channel name and channel id to
                                our logs. These logs are then deleted every 30 minutes.
                            </p>
                            <p className="pb-2">
                                On servers that opt into more in depth features, we may save other data such as whenever
                                a message is sent in a channel we increase a counter for that channel id. We do not
                                however save who sent it, why they sent it or even what they sent.
                            </p>
                        </p>
                        <div className="flex items-center justify-center">
                            <Image src="https://c.tenor.com/LlpblRprR9wAAAAC/stargate-sg1.gif" className="rounded" />
                        </div>
                        <h2 className="text-2xl text-primary font-semibold mb-4 mt-4 capitalize">
                            Why do the bots need the data and how do the bots use this data?
                        </h2>
                        <p className="pb-6">
                            <p className="pb-2">
                                The data is stored when you use a command to control how the bots will function for you
                                on your server. This data is needed to provide the functionality you chose to have
                                enabled on your server. For example, to create a welcome message, we store the message
                                you provided so that when a user joins we can send that message. Another example, when
                                you save words to be automoderated by gamer, those words are saved so we can know which
                                words to filter on your server.
                            </p>
                            <p className="pb-2">
                                Any of our logs to our console that are done for example when you run a command are used
                                for debugging and maintaince of the bots. For example, when you use a command certain
                                information is logged:
                                <ol>
                                    <li>- username#discriminator</li>
                                    <li>- user id</li>
                                    <li>- server name</li>
                                    <li>- server id</li>
                                    <li>- channel name</li>
                                    <li>- channel id</li>
                                </ol>
                            </p>
                            <p className="pb-2">
                                This information is logged for instance when we detect an abuse of the bots we can
                                determine which user is trying to abuse it. In an example, we had a server with some
                                users users constantly spamming the same command 24/7. This made it so that the bots
                                became extremely slow for all the other users on all other servers. The database became
                                slower due to the amount of queries and all of this was due to an abuse on Discord and
                                our bots.
                            </p>
                            <p className="pb-2">This data is deleted every 30 minutes!</p>
                        </p>

                        <div className="flex items-center justify-center">
                            <Image src="https://c.tenor.com/MADtblODGtsAAAAd/sam-carter-sam.gif" className="rounded" />
                        </div>

                        <h2 className="text-2xl text-primary font-semibold mb-4 mt-4 capitalize">
                            Other than Discord the company and users of your own bot on Discord the platform, who do you
                            share your collected data with, if anyone?
                        </h2>
                        <p className="pb-6">No one! We do not share data. NEVER!</p>

                        <div className="flex items-center justify-center">
                            <Image src="https://c.tenor.com/l5ttDzNlDNoAAAAd/stargate-stargate-sg1.gif" className="rounded" />
                        </div>

                        <h2 className="text-2xl text-primary font-semibold mb-4 mt-4 capitalize">
                            How can users have that data removed?
                        </h2>
                        <div className="pb-6">
                            <p className="pb-6">
                                If you wish to remove any data that we save, there is a simple command available.{" "}
                                <strong>/reset</strong>
                            </p>

                            <p>
                                If this command is ran on your server, the bot will remove all data related to your
                                server. If this command is ran in a private message(dm) with the bot, it will remove all
                                data for your account. However, it will not delete guild data related to your account
                                such as your mod logs, or other information that the server saves for your account. Use
                                the help settings reset command to learn how in more details.
                            </p>
                        </div>

                        <div className="flex items-center justify-center">
                            <Image src="https://c.tenor.com/JHWFmexHEvcAAAAd/tealc-stargate.gif" className="rounded" />
                        </div>

                        <h2 className="text-2xl text-primary font-semibold mb-4 mt-4">Data Storage</h2>
                        <p className="pb-6">
                            All stored data is kept on protected servers. Please keep in mind that even with these
                            protections, no data can ever be 100% secure. We are not liable for any damages or stolen
                            information, in which we collect, from our servers.
                        </p>

                        <div className="flex items-center justify-center">
                            <Image src="https://c.tenor.com/_lLh7trWyEgAAAAC/claudia-black.gif" className="rounded" />
                        </div>

                        <h2 className="text-2xl text-primary font-semibold mb-4 mt-4 capitalize">Have concerns about the bots?</h2>
                        <p className="pb-6">
                            IF YOU HAVE ANY QUESTIONS AT ANY TIME, DO NOT HESITATE TO CONTACT ME BY SENDING ME A PRIVATE
                            MESSAGE. MY DMS WILL ALWAYS BE OPEN FOR THIS SERVER!
                        </p>
                        <a className="text-warning" href="https://discord.gg/J4NqJ72">
                            Contact us!
                        </a>
                        <div className="flex items-center justify-center">
                            <Image src="https://c.tenor.com/ejlaRWsxo0YAAAAC/stargate-atlantis.gif" className="rounded" />
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
