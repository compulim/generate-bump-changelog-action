import type { SemVerRange } from "./types.js";
/**
 * Parses a range string into a SemVerRange object or throws a TypeError.
 * @param range The range string
 * @returns A valid semantic version range
 */
export declare function parseRange(range: string): SemVerRange;
