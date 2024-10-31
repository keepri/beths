// @ts-expect-error TODO import required due to bug in `@elysiajs/html` 1.1.1
import { Html } from "@elysiajs/html";

import { type ERROR_CODE } from "@/errors/constants";
import { Page } from "@/pages/components/server/page";

export type Props = {
    code: ERROR_CODE;
};

export function ErrorPage(props: Props) {
    return (
        <Page>
            <main class="grid place-items-center min-h-screen">
                <h1 class="text-3xl font-bold mb-2">Something went wrong</h1>
                <p class="text-center mb-4">#{props.code}</p>
                <a href="/" class="underline text-center">
                    Go home
                </a>
            </main>
        </Page>
    );
}
