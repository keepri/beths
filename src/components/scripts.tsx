import { staticDir } from "@/config";

export function Scripts() {
    return (
        <>
            <script src={staticDir("/htmx.min.js")}> </script>
            <script defer src={staticDir("/bundle.min.js")}> </script>
        </>
    );
}
