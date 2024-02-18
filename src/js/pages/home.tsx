import { BaseHtml } from "../components/base-html";

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
            </body>
        </BaseHtml>
    );
}
