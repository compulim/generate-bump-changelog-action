import type { FormatStyle, SemVer } from "./types.js";
/**
 * Format a SemVer object into a string.
 *
 * If any number is NaN then NaN will be printed.
 *
 * If any number is positive or negative infinity then '∞' or '⧞' will be printed instead.
 *
 * @param semver The semantic version to format
 * @returns The string representation of a semantic version.
 */
export declare function format(semver: SemVer, style?: FormatStyle): string;
