import type { SemVer, SemVerRange } from "./types.js";
/**
 * The minimum valid SemVer for a given range or INVALID
 * @param range The range to calculate the min for
 * @returns A valid SemVer or INVALID
 */
export declare function rangeMin(range: SemVerRange): SemVer;
