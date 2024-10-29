// @ts-expect-error TODO required due to bug in `@elysiajs/html` 1.1.1
import { Html } from "@elysiajs/html";

import { Button } from "@/pages/components/atoms/button";
import { BaseHtml } from "@/pages/components/server/base-html";

export function HomePage() {
    return (
        <BaseHtml>
            <body class="bg-sky-700">
                <h1 class="text-sky-500">
                    Hello,
                    <span class="text-rose-400"> world!</span>
                </h1>

                <x-demo foo="bar">
                    <h1 class="text-blue-300">Hello from child node.</h1>
                </x-demo>

                <Button class="block" hx-get="/api/v1/healthz">
                    HTMX is...
                </Button>
            </body>
        </BaseHtml>
    );
}
