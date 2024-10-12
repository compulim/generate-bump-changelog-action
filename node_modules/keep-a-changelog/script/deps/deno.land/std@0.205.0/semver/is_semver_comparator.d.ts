import type { SemVerComparator } from "./types.js";
/**
 * Does a deep check on the value to see if it is a valid SemVerComparator object.
 *
 * Objects with extra fields are still considered valid if they have at
 * least the correct fields.
 *
 * Adds a type assertion if true.
 * @param value The value to check if its a SemVerComparator
 * @returns True if the object is a SemVerComparator otherwise false
 */
export declare function isSemVerComparator(value: unknown): value is SemVerComparator;
