import { cmp } from "./cmp.js";
/**
 * Test to see if a semantic version falls within the range of the comparator.
 * @param version The version to compare
 * @param comparator The comparator
 * @returns True if the version is within the comparators set otherwise false
 */
export function testComparator(version, comparator) {
    return cmp(version, comparator.operator, comparator.semver);
}
