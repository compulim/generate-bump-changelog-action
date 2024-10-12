// Copyright 2018-2023 the Deno authors. All rights reserved. MIT license.
import { INVALID } from "./constants.js";
import { sort } from "./sort.js";
import { testRange } from "./test_range.js";
/**
 * The minimum valid SemVer for a given range or INVALID
 * @param range The range to calculate the min for
 * @returns A valid SemVer or INVALID
 */
export function rangeMin(range) {
    // For or's, you take the smallest min
    //[ [1 and 2] or [2 and 3] ] = [ 2 or 3 ] = 2
    return sort(range.ranges.map((r) => sort(r.filter((c) => testRange(c.min, range)).map((c) => c.min)).pop()).filter((v) => v)).shift() ?? INVALID;
}
