import Elysia from "elysia";

import { initHtml } from "@/config";
import { BaseHtml } from "@/js/components/base-html";

export const pages = new Elysia({ name: "Pages" })
    .use(initHtml())
    .get("/", function homePage() {
        return (
            <BaseHtml>
                <body class="bg-sky-700">
                    <h1 class="text-sky-500">
                        Hello,
                        <span class="text-rose-400"> world!</span>
                    </h1>

                    <demo-component foo="bar">
                        <h1 class="text-blue-300">Hello from child.</h1>
                    </demo-component>
                </body>
            </BaseHtml>
        );
    });
