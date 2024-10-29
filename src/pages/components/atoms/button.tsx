// @ts-expect-error TODO import required due to bug in `@elysiajs/html` 1.1.1
import { Html } from "@elysiajs/html";
import { clsx } from "clsx";
import { type JSX, type ParentProps, splitProps } from "solid-js";

type Props = ParentProps<JSX.HTMLAttributes<HTMLButtonElement>>;

export function Button(props: Props) {
    const [local, others] = splitProps(props, ["class", "children"]);

    return (
        <button
            hx-trigger="click delay:250ms"
            class={clsx(
                local.class,
                "text-white border rounded py-1 px-3 active:scale-95",
            )}
            {...others}
        >
            {local.children as "safe"}
        </button>
    );
}
