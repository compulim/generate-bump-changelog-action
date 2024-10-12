import { comparatorFormat } from "./comparator_format.js";
/**
 * Formats the range into a string
 * @example >=0.0.0 || <1.0.0
 * @param range The range to format
 * @returns A string representation of the range
 */
export function rangeFormat(range) {
    return range.ranges.map((c) => c.map((c) => comparatorFormat(c)).join(" "))
        .join("||");
}
