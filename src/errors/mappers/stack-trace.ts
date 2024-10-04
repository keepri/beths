import * as StackParser from "error-stack-parser";

import { log } from "@/config/logger";

export type StackTraceEntry = {
    function: string;
    position: string;
    file: string | undefined;
};

export function mapStackTrace<T extends Error>(
    error: T,
): Array<StackTraceEntry> {
    try {
        const parsedStack = StackParser.parse(error);
        const stack = parsedStack.map((frame) => ({
            function: frame.functionName ?? "<anonymous>",
            position: frame.lineNumber + ":" + frame.columnNumber,
            file: frame.fileName,
        }));

        return stack;
    } catch (error) {
        log.error("Could not parse error stack trace", error);

        return [];
    }
}
