// @ts-expect-error TODO import required due to bug in `@elysiajs/html` 1.1.0
import { Html } from "@elysiajs/html";
import { type ParentProps } from "solid-js";

import { staticDir } from "@/config";
import { type AppLanguage, env } from "@/config/env";

type Props = ParentProps<{
    title?: string;
    lang?: AppLanguage;
}>;

export function BaseHtml(props: Props) {
    props.lang ??= env.LANG;

    return (
        <html lang={props.lang}>
            <head>
                <title>{props.title as "safe"}</title>

                <meta charset="UTF-8" />
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1.0"
                />

                <link href={staticDir("styles.css")} rel="stylesheet" />

                <script src={staticDir("htmx.min.js")} />
                <script type="module" src={staticDir("bundle.min.js")} />
            </head>

            {props.children as "safe"}
        </html>
    );
}
