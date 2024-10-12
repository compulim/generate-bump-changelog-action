import type { SemVerComparator } from "./types.js";
/**
 * Formats the comparator into a string
 * @example >=0.0.0
 * @param comparator
 * @returns A string representation of the comparator
 */
export declare function comparatorFormat(comparator: SemVerComparator): string;
