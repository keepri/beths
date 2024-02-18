import "solid-js/types/jsx";
import { type ParentProps } from "solid-js/types/render/component";

declare module "solid-js/types/jsx" {
    namespace JSX {
        type DefaultAttributes = HTMLAttributes<HTMLElement>;
        type Props<T extends object = never> = ParentProps<
            // TODO handle this warning @see @typescript-eslint/indent rules
            T & DefaultAttributes
        >;

        // INFO We are declaring each custom element explicitly so that we can use them in JSX.
        // You can alternatively use `[componentName: string]: HtmlTag;` to allow any custom element name.
        // eslint-disable-next-line
        interface IntrinsicElements {
            "demo-component": Props<{ foo: string }>;
        }
    }
}
