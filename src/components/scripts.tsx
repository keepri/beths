import { fromStatic } from "@/config";

export function Scripts() {
    return (
        <>
            <script src={fromStatic("/htmx.min.js")}> </script>
        </>
    );
}
