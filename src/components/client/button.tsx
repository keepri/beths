// @ts-expect-error TODO import required due to bug in `@elysiajs/html` 1.1.1
import { Html } from "@elysiajs/html";
import { clsx } from "clsx";
import { type JSX, type ParentProps } from "solid-js";

type Props = ParentProps<JSX.HTMLAttributes<HTMLButtonElement>>;

export function Button(props: Props) {
    return (
        <button
            safe
            class={clsx(
                props.class,
                "text-white border rounded py-1 px-3 active:scale-95",
            )}
            onClick={props.onClick}
        >
            {props.children}
        </button>
    );
}
