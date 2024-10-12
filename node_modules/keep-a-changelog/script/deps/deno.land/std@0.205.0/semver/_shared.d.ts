import { Operator } from "./types.js";
export declare function compareNumber(a: number, b: number): 1 | 0 | -1;
export declare function checkIdentifier(v1: ReadonlyArray<string | number>, v2: ReadonlyArray<string | number>): 1 | 0 | -1;
export declare function compareIdentifier(v1: ReadonlyArray<string | number>, v2: ReadonlyArray<string | number>): 1 | 0 | -1;
declare const re: RegExp[];
declare const src: string[];
declare const NUMERICIDENTIFIER: number;
declare const FULL: number;
declare const XRANGE: number;
declare const TILDE: number;
declare const CARET: number;
declare const COMPARATOR: number;
declare const HYPHENRANGE: number;
declare const STAR: number;
/**
 * Returns true if the value is a valid SemVer number.
 *
 * Must be a number. Must not be NaN. Can be positive or negative infinity.
 * Can be between 0 and MAX_SAFE_INTEGER.
 * @param value The value to check
 * @returns True if its a valid semver number
 */
export declare function isValidNumber(value: unknown): value is number;
export declare const MAX_LENGTH = 256;
/**
 * Returns true if the value is a valid semver pre-release or build identifier.
 *
 * Must be a string. Must be between 1 and 256 characters long. Must match
 * the regular expression /[0-9A-Za-z-]+/.
 * @param value The value to check
 * @returns True if the value is a valid semver string.
 */
export declare function isValidString(value: unknown): value is string;
/**
 * Checks to see if the value is a valid Operator string.
 *
 * Adds a type assertion if true.
 * @param value The value to check
 * @returns True if the value is a valid Operator string otherwise false.
 */
export declare function isValidOperator(value: unknown): value is Operator;
export { CARET, COMPARATOR, FULL, HYPHENRANGE, NUMERICIDENTIFIER, re, src, STAR, TILDE, XRANGE, };
