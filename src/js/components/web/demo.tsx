import { type ComponentOptions } from "component-register";
import { noShadowDOM } from "solid-element";
import { customElement } from "solid-element";
import { createSignal } from "solid-js";
import { isServer } from "solid-js/web";

import { Button } from "../button";

type Props = {
    foo: string;
};

const INIT_PROPS: Props = { foo: "" } as const;

export function Demo(props: Props, { element }: ComponentOptions) {
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

if (!isServer) {
    customElement<Props>("x-demo", INIT_PROPS, Demo);
}
