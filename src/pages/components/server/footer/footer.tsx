// @ts-expect-error TODO import required due to bug in `@elysiajs/html` 1.1.1
import { Html } from "@elysiajs/html";
import { clsx } from "clsx";
import { type JSX, type ParentProps, splitProps } from "solid-js";

type Props = ParentProps<JSX.HTMLAttributes<HTMLElement>>;

export function Footer(props: Props) {
    const [local, others] = splitProps(props, ["class"]);

    return (
        <footer class={clsx(local.class, "")} {...others}>
            <main class="container">
                <p>footer</p>
            </main>
        </footer>
    );
}
