import "solid-js/types/jsx";
import { type ParentProps } from "solid-js/types/render/component";

import { type auth } from "@/auth";
import { type DatabaseSession, type DatabaseUser } from "@/db/schema";

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
            "x-demo": Props<{ foo: string }>;
        }

        // eslint-disable-next-line
        interface HTMLAttributes {
            safe?: boolean;
        }
    }
}

declare module "lucia" {
    // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
    interface Register {
        Lucia: typeof auth;
        DatabaseSessionAttributes: DatabaseSession;
        DatabaseUserAttributes: DatabaseUser;
    }
}
