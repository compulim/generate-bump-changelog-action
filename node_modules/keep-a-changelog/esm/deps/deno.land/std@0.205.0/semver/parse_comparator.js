// Copyright 2018-2023 the Deno authors. All rights reserved. MIT license.
import { parse } from "./parse.js";
import { COMPARATOR, re } from "./_shared.js";
import { comparatorMax } from "./comparator_max.js";
import { comparatorMin } from "./comparator_min.js";
import { ANY, NONE } from "./constants.js";
/**
 * Parses a comparator string into a valid SemVerComparator.
 * @param comparator
 * @returns A valid SemVerComparator
 */
export function parseComparator(comparator) {
    const r = re[COMPARATOR];
    const m = comparator.match(r);
    if (!m) {
        return NONE;
    }
    const operator = (m[1] ?? "");
    const semver = m[2] ? parse(m[2]) : ANY;
    const min = comparatorMin(semver, operator);
    const max = comparatorMax(semver, operator);
    return {
        operator,
        semver,
        min,
        max,
    };
}
