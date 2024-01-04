import Elysia from "elysia";
import { html } from "@elysiajs/html";

import { BaseHtml } from "../components/base";

export const pages = new Elysia({ name: "Pages" })
    .use(html())
    .get("/", function homePage() {
        return (
            // @ts-expect-error TODO
            <BaseHtml>
                <body class="bg-slate-700">
                    <h1 class="text-sky-500">
                        Hello,
                        <span class="text-rose-400"> world!</span>
                    </h1>
                </body>
            </BaseHtml>
        );
    });
