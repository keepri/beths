import { type JSX, type ParentProps } from "solid-js";

type Props = ParentProps<{
    onClick?: JSX.ChangeEventHandler<JSX.HTMLElementTags["button"], Event>;
}>;

export function Button(props: Props) {
    return (
        <button
            class="text-white border rounded py-1 px-3 active:scale-95"
            onClick={props.onClick}
        >
            {props.children as "safe"}
        </button>
    );
}
