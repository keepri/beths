type PageTag = "home" | "not-found";
export type SSGPageTag<T extends string = PageTag> = `${T}-page`;
