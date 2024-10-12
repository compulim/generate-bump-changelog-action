import type { SemVer, SemVerComparator } from "./types.js";
/**
 * MAX is a sentinel value used by some range calculations.
 * It is equivalent to `∞.∞.∞`.
 */
export declare const MAX: SemVer;
/**
 * The minimum valid SemVer object. Equivalent to `0.0.0`.
 */
export declare const MIN: SemVer;
/**
 * A sentinel value used to denote an invalid SemVer object
 * which may be the result of impossible ranges or comparator operations.
 * @example
 * ```ts
 * import { eq } from "https://deno.land/std@$STD_VERSION/semver/eq.ts";
 * import { parse } from "https://deno.land/std@$STD_VERSION/semver/parse.ts";
 * import { INVALID } from "https://deno.land/std@$STD_VERSION/semver/constants.ts"
 * eq(parse("1.2.3"), INVALID);
 * ```
 */
export declare const INVALID: SemVer;
/**
 * ANY is a sentinel value used by some range calculations. It is not a valid
 * SemVer object and should not be used directly.
 * @example
 * ```ts
 * import { eq } from "https://deno.land/std@$STD_VERSION/semver/eq.ts";
 * import { parse } from "https://deno.land/std@$STD_VERSION/semver/parse.ts";
 * import { ANY } from "https://deno.land/std@$STD_VERSION/semver/constants.ts"
 * eq(parse("1.2.3"), ANY); // false
 * ```
 */
export declare const ANY: SemVer;
/**
 * A comparator which will span all valid semantic versions
 */
export declare const ALL: SemVerComparator;
/**
 * A comparator which will not span any semantic versions
 */
export declare const NONE: SemVerComparator;
