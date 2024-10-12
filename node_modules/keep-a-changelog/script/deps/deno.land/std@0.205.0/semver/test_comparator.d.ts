import type { SemVer, SemVerComparator } from "./types.js";
/**
 * Test to see if a semantic version falls within the range of the comparator.
 * @param version The version to compare
 * @param comparator The comparator
 * @returns True if the version is within the comparators set otherwise false
 */
export declare function testComparator(version: SemVer, comparator: SemVerComparator): boolean;
