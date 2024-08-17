import { type ParentProps } from "solid-js";

import { APP_NAME, staticDir } from "@/config";

type Languages = "en";

type Props = ParentProps<{
    title?: string;
    lang?: Languages;
}>;

export function BaseHtml(props: Props) {
    props.lang ??= "en";
    props.title ??= APP_NAME;

    return (
        <html lang={props.lang}>
            <head>
                <title>{props.title as "safe"}</title>

                <meta charset="UTF-8" />
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1.0"
                />

                <link href={staticDir("/styles.css")} rel="stylesheet" />

                <script src={staticDir("/htmx.min.js")} />
                <script type="module" src={staticDir("/bundle.min.js")} />
            </head>

            {props.children as "safe"}
        </html>
    );
}
