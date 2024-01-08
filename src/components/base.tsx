import { APP_NAME, staticDir } from "@/config";

type Props = {
    children?: JSX.Element | Array<JSX.Element>;
    title?: string;
    lang?: "en";
};

export function BaseHtml(props?: Props) {
    const safeChildren = props?.children;
    return (
        <html lang={props?.lang || "en"}>
            <head>
                <meta charset="UTF-8" />
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1.0"
                />
                <title>{props?.title ?? APP_NAME}</title>
                <script src={staticDir("/htmx.min.js")}></script>
                <link href={staticDir("/styles.css")} rel="stylesheet" />
            </head>

            {safeChildren}
        </html>
    );
}
