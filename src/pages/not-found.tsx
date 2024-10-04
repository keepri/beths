// @ts-expect-error TODO import required due to bug in `@elysiajs/html` 1.1.1
import { Html } from "@elysiajs/html";

import { BaseHtml } from "@/components/server/base-html";
import { type ERROR_CODE } from "@/errors/constants";

export type Props = {
    code: ERROR_CODE;
};

export function NotFoundPage(props: Props) {
    return (
        <BaseHtml>
            <body class="grid place-items-center min-h-screen">
                <main>
                    <h1 class="text-3xl font-bold mb-2">Resource not found</h1>
                    <p class="text-center mb-4">#{props.code}</p>
                    <a href="/" class="underline text-center">
                        Go home
                    </a>
                </main>
            </body>
        </BaseHtml>
    );
}
