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
                        src="https://c.tenor.com/6EkoG3mcDLEAAAAd/baal-stargate.gif"
                        className="absolute left-0 top-0 w-full h-full z-0"
                    />
                    <div className="p-4 absolute bottom-0 left-0 z-20">
                        <a
                            href="#"
                            className="px-4 py-1 bg-primary rounded text-gray-200 inline-flex items-center justify-center mb-2"
                        >
                            Legal
                        </a>
                        <h2 className="text-4xl font-semibold text-gray-100 leading-tight">Terms of Service</h2>
                        <div className="flex mt-3">
                            <Image src={Logo} className="h-10 w-10 rounded-full mr-2 object-cover" />
                            <div>
                                <p className="font-semibold text-gray-200 text-sm"> Gamer Team </p>
                                <p className="font-semibold text-gray-400 text-xs">
                                    {" "}
                                    Last Updated: January 13th, 2022{" "}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-screen-xl mx-auto">
                <div className="">
                    <div className="px-4 lg:px-0 mt-12 text-info max-w-screen-md mx-auto text-lg leading-relaxed">
                        <p className="pb-6">
                            This terms of service that you agree to and accept when adding any of our "Gamer" bots to
                            your server, or as a member of any server in which Gamer bots are on. "Gamer" bots refer to
                            bots created and hosted by us at{" "}
                            <a href={SUPPORT_SERVER} className="text-warning">
                                {SUPPORT_SERVER}
                            </a>
                            {". "}
                            The code may be public and therefore anyone can host their own version. Those are not
                            "Gamer" bots! These terms applies to all of the following applications but not limited to:
                        </p>
                        <ol className="pb-6">
                            <li>- Gamer#5758</li>
                            <li>- Gamer-Beta#4271</li>
                            <li>- Gamer-Canary#4383</li>
                            <li>- VIP-1#3480</li>
                        </ol>
                        <h2 className="text-2xl text-primary font-semibold mb-4 mt-4">Eligibility</h2>
                        <p className="pb-6">
                            In order to use the Services, you must be at least 18 years of age, you must have permission
                            from your parent or legal guardian if you are younger than the age of majority in your
                            jurisdiction, and you must not be barred from receiving the Services under applicable law.
                            You must only use the Services in compliance with these Terms of Service and all applicable
                            federal, state, and local laws and regulations. If you use the Services, you represent and
                            warrant to us that these things are true.
                        </p>
                        <div className="flex items-center justify-center">
                            <Image src="https://c.tenor.com/13mZxHD4BEYAAAAC/oldenough-police.gif" className="rounded" />
                        </div>
                        <h2 className="text-2xl text-primary font-semibold mb-4 mt-4 capitalize">
                            What you may not use (or attempt to use) the service for
                        </h2>
                        <p className="pb-6">
                            <ol>
                                <li>
                                    - Harassing, stalking, threatening, doxxing, shaming or otherwise defacing people.
                                </li>
                                <li>- Distributing any kind of malware through the use of the service.</li>
                                <li>- Advertising services/products of any kind.</li>
                                <li>
                                    - Circumventing tools that allow users to protect themselves (such as Discord
                                    blocks/bans) Engaging in fraudulent activities or harmful to other users.
                                </li>
                                <li>
                                    - Attempting to collect personal data (including but not limited to e-mail
                                    addresses, passwords and tokens) of users.
                                </li>
                                <li>
                                    - Anything that inducts the service to violate the{" "}
                                    <a href="https://discord.com/terms" className="text-warning">
                                        Discord Terms of Service
                                    </a>
                                    , or{" "}
                                    <a href="https://discord.com/privacy" className="text-warning">
                                        Discord Privacy Policy
                                    </a>
                                    , or{" "}
                                    <a href="https://discord.com/guidelines" className="text-warning">
                                        Community guidelines
                                    </a>
                                    .
                                </li>
                            </ol>
                        </p>

                        <div className="flex items-center justify-center">
                            <Image src="https://c.tenor.com/7ULDQAs-PjYAAAAC/no-stargate.gif"  className="rounded"/>
                        </div>

                        <h2 className="text-2xl text-primary font-semibold mb-4 mt-4 capitalize">
                            The following is forbidden and will result in action being taken on the responsible user<span className="lowercase">(s)</span>
                        </h2>
                        <p className="pb-6">
                            <ol>
                                <li>- Attempting to make the service (or any part of it) unavailable to peers.</li>
                                <li>
                                    - Attempting to decompile, modify, exploit, sell, resell or reverse-engineer any part
                                    of the service.
                                </li>
                                <li>
                                    - Circumventing security measures that allow the service to be available for
                                    everyone.
                                </li>
                                <li>
                                    - Hindering the development or modification of the service in any way, either active
                                    or passive.
                                </li>
                                <li>
                                    - Acting or omitting actions to put or maintain the service in a state which would
                                    disfavor the service itself in terms of quality or useability, either for the actor
                                    itself or to peers.
                                </li>
                            </ol>
                        </p>

                        <div className="flex items-center justify-center">
                            <Image src="https://c.tenor.com/l5ttDzNlDNoAAAAd/stargate-stargate-sg1.gif" className="rounded" />
                        </div>

                        <h2 className="text-2xl text-primary font-semibold mb-4 mt-4">Licenses Granted by You</h2>
                        <div className="pb-6">
                            <p className="pb-6">
                                By creating, distributing, posting, publishing, submitting, transmitting, uploading or
                                otherwise providing or using any content with the bots, you grant us an assignable,
                                non-exclusive, perpetual, royalty-free, transferable, unrestricted, and worldwide
                                license and right to adapt, communicate, copy, display, distribute, host, modify (in
                                whole or in part), perform, process, publish, reproduce, store, sublicense, translate,
                                transmit, use, and create derivative works of such using any means, mediums, or methods
                                now known or later developed for the sole purpose of operating and providing the
                                Services. In addition, by making anything available to users of the Services, you grant
                                those users a non-exclusive license to access and use anything in connection with the
                                Services.
                            </p>

                            <p>
                                If you give or make any comments, feedback, ideas, recommendations, or suggestions
                                ("Feedback"), you hereby assign all rights, title, and interest in and to such Feedback
                                to the bots without charge. You acknowledge and agree that we shall be free to
                                commercialize, exploit, implement, share, and use any Feedback you provide to us in any
                                way and for any purpose. We shall not be liable to you or any third party for any
                                disclosure, exploitation, implementation, or use of any Feedback. You shall not give us
                                any Feedback that is subject to any license.
                            </p>
                        </div>

                        <div className="flex items-center justify-center">
                            <Image src="https://c.tenor.com/JHWFmexHEvcAAAAd/tealc-stargate.gif" className="rounded" />
                        </div>

                        <h2 className="text-2xl text-primary font-semibold mb-4 mt-4">User-Generated Content</h2>
                        <p className="pb-6">
                            The service lets their users upload, post or transmit user-generated content. Any
                            user-generated content is not endorsed by us and we neither are responsible for it. If you
                            feel any user-generated content residing in our service violates these terms, please report
                            it to our Staff. Owners of user-generated content may request the deletion of said content
                            by reaching out our staff. We will try our best to remove said data in the shortest amount
                            of time possible.
                        </p>

                        <div className="flex items-center justify-center">
                            <Image src="https://c.tenor.com/zVqNNFVZnBIAAAAC/daniel-jackson-stargate.gif" className="rounded" />
                        </div>

                        <h2 className="text-2xl text-primary font-semibold mb-4 mt-4">Assumption of Good Faith</h2>
                        <p className="pb-6">
                            As the user uses the service or make any claims to us, we assume good faith in their word or
                            actions, and shall not be broken by their side. Repeatedly making false claims or breaking
                            this assumption is grounds for termination.
                        </p>

                        <div className="flex items-center justify-center">
                            <Image src="https://c.tenor.com/WvOMDVLlRl0AAAAC/stargate-sg1.gif" className="rounded" />
                        </div>

                        <h2 className="text-2xl text-primary font-semibold mb-4 mt-4">Final Notes</h2>
                        <p className="pb-6">
                            <ul>
                                <li>
                                    - Our Staff deserves the right to terminate or restrict your use of the service (or
                                    parts of) for any reason at any time, without prior warning or further notice.
                                </li>
                                <li>
                                    - We deserve the right to refuse the use of the service (or parts of it) to anyone.
                                </li>
                                <li>- Ability to use this service is a privilege, use it wisely.</li>
                                <li>
                                    - A violation of the Acceptable Use Policy is considered to be committed regardless
                                    of any countermeasures (whether enacted or hypothetical) taken by the service to
                                    nullify or reduce the damage caused by the violation.
                                </li>
                                <li>
                                    - We always encourage our users to collaborate with the Staff to improve their
                                    experience (and consequently their peers') with the service.
                                </li>
                                <li>
                                    - Always keep in mind that this document is not exhaustive, and we deserve to make
                                    any change to it without warning or notice, though we will always try our best to
                                    inform users through non-intrusive means if this happens.
                                </li>
                                <li>
                                    - If something is not listed in those rules it does not mean you're allowed to
                                    persevere in that conduct.
                                </li>
                            </ul>
                        </p>

                        <div className="flex items-center justify-center">
                            <Image src="https://c.tenor.com/p8CJIfkC2CEAAAAd/stargate-jack.gif" className="rounded" />
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
