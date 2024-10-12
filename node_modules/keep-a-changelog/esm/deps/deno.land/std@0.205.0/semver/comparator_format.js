import { format } from "./format.js";
/**
 * Formats the comparator into a string
 * @example >=0.0.0
 * @param comparator
 * @returns A string representation of the comparator
 */
export function comparatorFormat(comparator) {
    const { semver, operator } = comparator;
    return `${operator}${format(semver)}`;
}
