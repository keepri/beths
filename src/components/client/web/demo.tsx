import { noShadowDOM } from "solid-element";
import { customElement } from "solid-element";
import { Show, createSignal } from "solid-js";
import { isServer } from "solid-js/web";

import { Button } from "../button";

type Props = {
    foo: string;
};

const NAME = "x-demo";
const INIT_PROPS: Props = { foo: "" } as const;

if (!isServer) {
    customElement<Props>(
        NAME,
        INIT_PROPS,
        function Demo(props, { element: { children } }) {
            noShadowDOM();

            const [msg, setMsg] = createSignal<string>("");

            function handleClick() {
                console.log("Hello, console!");
                setMsg("Hello from Solid!");
            }

            return (
                <>
                    {children[0] as "safe"}

                    <Show when={Boolean(msg())}>
                        <h1 safe class="text-red-400">
                            {msg()}
                        </h1>
                    </Show>

                    <Button onClick={handleClick}>say hi</Button>

                    <p safe class="text-green-300">
                        {props.foo}
                    </p>
                </>
            );
        },
    );
}
