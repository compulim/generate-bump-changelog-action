import { ANY, MAX, MIN } from "./constants.js";
import { gt } from "./gt.js";
import { increment } from "./increment.js";
/**
 * The minimum semantic version that could match this comparator
 * @param semver The semantic version of the comparator
 * @param operator The operator of the comparator
 * @returns The minimum valid semantic version
 */
export function comparatorMin(semver, operator) {
    if (semver === ANY) {
        return MIN;
    }
    switch (operator) {
        case ">":
            return semver.prerelease.length > 0
                ? increment(semver, "pre")
                : increment(semver, "patch");
        case "!=":
        case "!==":
        case "<=":
        case "<":
            // The min(<0.0.0) is MAX
            return gt(semver, MIN) ? MIN : MAX;
        case ">=":
        case "":
        case "=":
        case "==":
        case "===":
            return semver;
    }
}
