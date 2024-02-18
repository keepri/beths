import { type JSX, type ParentProps, children } from "solid-js";

type Props = ParentProps<{
    onClick: JSX.ChangeEventHandler<HTMLButtonElement, Event>;
}>;

export function Button(props: Props) {
    const safeChildren = children(() => props.children);

    return (
        <button
            class="text-white border rounded py-1 px-3 active:scale-95"
            onClick={props.onClick}
        >
            {safeChildren()}
        </button>
    );
}
