import Elysia from "elysia";

import { BaseHtml } from "@/components/base";
import { initHtml } from "@/config";

export const pages = new Elysia({ name: "Pages" })
    .use(initHtml())
    .get("/", function homePage() {
        return (
            // @ts-expect-error
            <BaseHtml>
                <body class="bg-sky-700">
                    <h1 class="text-sky-500">
                        Hello,
                        <span class="text-rose-400"> world!</span>
                    </h1>
                </body>
            </BaseHtml>
        );
    });
