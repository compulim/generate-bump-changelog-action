import type { SemVer, SemVerRange } from "./types.js";
/**
 * Test to see if the version satisfies the range.
 * @param version The version to test
 * @param range The range to check
 * @returns true if the version is in the range
 */
export declare function testRange(version: SemVer, range: SemVerRange): boolean;
