// @ts-expect-error TODO import required due to bug in `@elysiajs/html` 1.1.1
import { Html } from "@elysiajs/html";
import { type ParentProps } from "solid-js";

import { Footer } from "./footer/footer";
import { HtmlTag } from "./html";
import { Navbar } from "./navbar/navbar";

type Props = ParentProps;

export function Page(props: Props) {
    return (
        <HtmlTag>
            <body class="bg-sky-700">
                <Navbar />
                {props.children as "safe"}
                <Footer />
            </body>
        </HtmlTag>
    );
}
