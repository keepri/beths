import { type ComponentOptions } from "component-register";
import { noShadowDOM } from "solid-element";
import { createSignal } from "solid-js";

import { Button } from "./button";

export const initProps = { foo: "" };

export function DemoComponent(
    props: typeof initProps,
    { element }: ComponentOptions,
) {
    noShadowDOM();

    const safeFoo = props.foo;

    const [msg, setMsg] = createSignal<string>("");

    function handleClick() {
        setMsg("hi");
    }

    return (
        <>
            <h1 class="text-red-400">{msg() as "safe"}</h1>

            <Button onClick={handleClick}>say hi</Button>

            {element.children[0] as "safe"}

            <p class="text-green-300">{safeFoo}</p>
        </>
    );
}
