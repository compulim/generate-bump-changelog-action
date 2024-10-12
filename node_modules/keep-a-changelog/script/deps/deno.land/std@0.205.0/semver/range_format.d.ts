import type { SemVerRange } from "./types.js";
/**
 * Formats the range into a string
 * @example >=0.0.0 || <1.0.0
 * @param range The range to format
 * @returns A string representation of the range
 */
export declare function rangeFormat(range: SemVerRange): string;
