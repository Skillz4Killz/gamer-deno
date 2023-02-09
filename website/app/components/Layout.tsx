import { ReactNode, SetStateAction } from "react";
import { SessionData } from "~/utils/session.server";
import Footer from "./Footer";
import Header from "./Header";

interface LayoutProps {
    children?: ReactNode;
    setLastWaveColor?: (value: SetStateAction<string>) => void;
    fixedFooter?: boolean;
    user?: SessionData | null;
}

export default function Layout(props: LayoutProps) {
    return (
        <div>
            {props.user ? null : <Header setLastWaveColor={props.setLastWaveColor} />}
            {props.children}
            <div className={props.fixedFooter ? "fixed bottom-0 w-full" : ""}>
                <Footer setLastWaveColor={props.setLastWaveColor} />
            </div>
        </div>
    );
}
