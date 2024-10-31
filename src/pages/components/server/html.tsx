// @ts-expect-error TODO required due to bug in `@elysiajs/html` 1.1.1
import { Html } from "@elysiajs/html";
import { type ParentProps } from "solid-js";

import { env } from "@/config/env";
import { staticDir } from "@/config/lib";
import { type AppLanguage } from "@/config/types";

type Props = ParentProps<{
    title?: string;
    lang?: AppLanguage;
}>;

export function HtmlTag(props: Props) {
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

                <link href={"/" + staticDir("styles.css")} rel="stylesheet" />

                <script type="module" src={"/" + staticDir("bundle.min.js")} />
            </head>

            {props.children as "safe"}
        </html>
    );
}
