// @ts-expect-error TODO required due to bug in `@elysiajs/html` 1.1.1
import { Html } from "@elysiajs/html";
import { type User } from "lucia";

import { BaseHtml } from "@/components/server/base-html";
import { createAPIPath } from "@/routes/lib/api-path";

export type Props = {
    user: User | null;
};

export function HomePage(props: Props) {
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

                {!props.user ? (
                    <a
                        href={createAPIPath("/login/github")}
                        class="text-teal-300 underline"
                    >
                        Sign in with GitHub
                    </a>
                ) : (
                    <p safe class="text-purple-300">
                        Welcome, {props.user.username}.
                    </p>
                )}
            </body>
        </BaseHtml>
    );
}
