import "solid-js/types/jsx";
import { type ParentProps } from "solid-js/types/render/component";

import { type Props as DemoProps } from "@/components/client/web-components/demo";
import { type LUCIA } from "@/config/lucia";
import { type DbSession, type DbUser } from "@/db/types";

declare module "solid-js/types/jsx" {
    namespace JSX {
        type DefaultAttributes = HTMLAttributes<HTMLElement>;
        type Props<T extends object = never> = ParentProps<
            T & DefaultAttributes
        >;

        // INFO We are declaring each custom element explicitly so that we can use them in JSX.
        // You can alternatively use `[componentName: string]: HtmlTag;` to allow any custom element name.
        // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
        interface IntrinsicElements {
            "x-demo": Props<DemoProps>;
        }

        // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
        interface HTMLAttributes {
            safe?: boolean;
        }
    }
}

declare module "lucia" {
    // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
    interface Register {
        Lucia: typeof LUCIA;
        DatabaseSessionAttributes: DbSession;
        DatabaseUserAttributes: DbUser;
    }
}
