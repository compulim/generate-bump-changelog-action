import type { SemVerRange } from "./types.js";
/**
 * Does a deep check on the object to determine if its a valid range.
 *
 * Objects with extra fields are still considered valid if they have at
 * least the correct fields.
 *
 * Adds a type assertion if true.
 * @param value The value to check if its a valid SemVerRange
 * @returns True if its a valid SemVerRange otherwise false.
 */
export declare function isSemVerRange(value: unknown): value is SemVerRange;
