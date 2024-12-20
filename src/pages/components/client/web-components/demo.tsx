import { customElement, noShadowDOM } from "solid-element";
import { Show, Suspense, createResource, createSignal } from "solid-js";
import { isServer } from "solid-js/web";

import { Button } from "@/pages/components/atoms/button";

export type Props = {
    foo: "bar";
};

const NAME = "x-demo";
const INIT_PROPS: Props = {
    foo: "bar",
} as const;

if (!isServer) {
    customElement<Props>(
        NAME,
        INIT_PROPS,
        function Demo(props: Props, { element: { children } }) {
            noShadowDOM();

            const [resource] = createResource<string>(async function () {
                return new Promise((resolve) => {
                    setTimeout(() => {
                        resolve("DARY!");
                    }, 1000);
                });
            });

            const [msg, setMsg] = createSignal<string>("");

            function handleClick() {
                console.log("Hello, console!");
                setMsg("Hello from Solid!");
            }

            return (
                <>
                    {children[0] as "safe"}

                    <Suspense fallback={<h1>Wait for it...</h1>}>
                        <h1 safe class="text-white">
                            {resource()}
                        </h1>
                    </Suspense>

                    <Show when={Boolean(msg())}>
                        <h1 safe class="text-red-400">
                            {msg()}
                        </h1>
                    </Show>

                    <Button onClick={handleClick}>say hi</Button>

                    <p class="text-green-300">{props.foo}</p>
                </>
            );
        },
    );
}
