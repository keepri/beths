// @ts-expect-error TODO required due to bug in `@elysiajs/html` 1.1.1
import { Html } from "@elysiajs/html";

import { Button } from "@/pages/components/atoms/button";
import { Page } from "@/pages/components/server/page";
import { createAPIPath } from "@/routes/lib/api-path";

export function HomePage() {
    return (
        <Page>
            <main class="container">
                <h1 class="text-sky-500">
                    Hello,
                    <span class="text-rose-400"> world!</span>
                </h1>

                <x-demo foo="bar">
                    <h1 class="text-blue-300">Hello from child node.</h1>
                </x-demo>

                <Button class="block" hx-get={createAPIPath("/healthz")}>
                    HTMX is...
                </Button>
            </main>
        </Page>
    );
}
