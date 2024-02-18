import { customElement } from "solid-element";

import { DemoComponent, initProps } from "./components/demo-component";

customElement<typeof initProps>("demo-component", initProps, DemoComponent);
