import type { SemVerComparator } from "./types.js";
/**
 * Returns true if the range of possible versions intersects with the other comparators set of possible versions
 * @param c0 The left side comparator
 * @param c1 The right side comparator
 * @returns True if any part of the comparators intersect
 */
export declare function comparatorIntersects(c0: SemVerComparator, c1: SemVerComparator): boolean;
