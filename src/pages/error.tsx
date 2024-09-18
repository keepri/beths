// @ts-expect-error TODO import required due to bug in `@elysiajs/html` 1.1.1
import { Html } from "@elysiajs/html";

import { BaseHtml } from "@/components/server/base-html";
import { type ERROR_CODE } from "@/errors/lib/constants";

export type Props = {
    code: ERROR_CODE;
};

export function ErrorPage(props: Props) {
    return (
        <BaseHtml>
            <body class="grid place-items-center min-h-screen">
                <main>
                    <h1 class="text-3xl font-bold mb-4">
                        Something went wrong
                    </h1>
                    <p class="text-center">#{props.code}</p>
                </main>
            </body>
        </BaseHtml>
    );
}
