import { type User } from "lucia";

import { BaseHtml } from "../components/server/base-html";

export type HomePageProps = {
    user: User | null;
};

export function HomePage(props: HomePageProps) {
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

                {props.user && (
                    <p safe class="text-purple-300">
                        Welcome, {props.user.username}.
                    </p>
                )}

                {!props.user && (
                    <a
                        href="/api/v1/login/github"
                        class="text-teal-300 underline"
                    >
                        Sign in with GitHub
                    </a>
                )}
            </body>
        </BaseHtml>
    );
}
