import { Html } from "@elysiajs/html";

import { Scripts } from "@/components/scripts";
import { APP_NAME, fromStatic } from "@/config";

type Languages = "en";

type Props = Html.PropsWithChildren<{
    title?: string;
    lang?: Languages;
}>;

export function BaseHtml(props: Props) {
    const safeChildren = props?.children;

    return (
        <html lang={props?.lang || "en"}>
            <head>
                <title>{props?.title ?? APP_NAME}</title>

                <meta charset="UTF-8" />
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1.0"
                />

                <link href={fromStatic("/styles.css")} rel="stylesheet" />

                <Scripts />
            </head>

            {safeChildren}
        </html>
    );
}
