import type { Operator, SemVer } from "./types.js";
/**
 * The maximum version that could match this comparator.
 *
 * If an invalid comparator is given such as <0.0.0 then
 * an out of range semver will be returned.
 * @returns the version, the MAX version or the next smallest patch version
 */
export declare function comparatorMax(semver: SemVer, operator: Operator): SemVer;
