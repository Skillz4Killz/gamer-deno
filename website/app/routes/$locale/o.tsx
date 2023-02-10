import { useTranslation } from "react-i18next";

export default function Index() {
    const { t } = useTranslation("common");

    return (
        <div>
            <button className="btn">{t("test", { tests: "test" })} </button>
        </div>
    );
}
