import type { Operator, SemVer } from "./types.js";
/**
 * The minimum semantic version that could match this comparator
 * @param semver The semantic version of the comparator
 * @param operator The operator of the comparator
 * @returns The minimum valid semantic version
 */
export declare function comparatorMin(semver: SemVer, operator: Operator): SemVer;
