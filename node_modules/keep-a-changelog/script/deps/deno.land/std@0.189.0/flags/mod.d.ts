/** Combines recursively all intersection types and returns a new single type. */
type Id<TRecord> = TRecord extends Record<string, unknown> ? TRecord extends infer InferredRecord ? {
    [Key in keyof InferredRecord]: Id<InferredRecord[Key]>;
} : never : TRecord;
/** Converts a union type `A | B | C` into an intersection type `A & B & C`. */
type UnionToIntersection<TValue> = (TValue extends unknown ? (args: TValue) => unknown : never) extends (args: infer R) => unknown ? R extends Record<string, unknown> ? R : never : never;
type BooleanType = boolean | string | undefined;
type StringType = string | undefined;
type ArgType = StringType | BooleanType;
type Collectable = string | undefined;
type Negatable = string | undefined;
type UseTypes<TBooleans extends BooleanType, TStrings extends StringType, TCollectable extends Collectable> = undefined extends ((false extends TBooleans ? undefined : TBooleans) & TCollectable & TStrings) ? false : true;
/**
 * Creates a record with all available flags with the corresponding type and
 * default type.
 */
type Values<TBooleans extends BooleanType, TStrings extends StringType, TCollectable extends Collectable, TNegatable extends Negatable, TDefault extends Record<string, unknown> | undefined, TAliases extends Aliases | undefined> = UseTypes<TBooleans, TStrings, TCollectable> extends true ? Record<string, unknown> & AddAliases<SpreadDefaults<CollectValues<TStrings, string, TCollectable, TNegatable> & RecursiveRequired<CollectValues<TBooleans, boolean, TCollectable>> & CollectUnknownValues<TBooleans, TStrings, TCollectable, TNegatable>, DedotRecord<TDefault>>, TAliases> : Record<string, any>;
type Aliases<TArgNames = string, TAliasNames extends string = string> = Partial<Record<Extract<TArgNames, string>, TAliasNames | ReadonlyArray<TAliasNames>>>;
type AddAliases<TArgs, TAliases extends Aliases | undefined> = {
    [TArgName in keyof TArgs as AliasNames<TArgName, TAliases>]: TArgs[TArgName];
};
type AliasNames<TArgName, TAliases extends Aliases | undefined> = TArgName extends keyof TAliases ? string extends TAliases[TArgName] ? TArgName : TAliases[TArgName] extends string ? TArgName | TAliases[TArgName] : TAliases[TArgName] extends Array<string> ? TArgName | TAliases[TArgName][number] : TArgName : TArgName;
/**
 * Spreads all default values of Record `TDefaults` into Record `TArgs`
 * and makes default values required.
 *
 * **Example:**
 * `SpreadValues<{ foo?: boolean, bar?: number }, { foo: number }>`
 *
 * **Result:** `{ foo: boolean | number, bar?: number }`
 */
type SpreadDefaults<TArgs, TDefaults> = TDefaults extends undefined ? TArgs : TArgs extends Record<string, unknown> ? Omit<TArgs, keyof TDefaults> & {
    [Default in keyof TDefaults]: Default extends keyof TArgs ? (TArgs[Default] & TDefaults[Default] | TDefaults[Default]) extends Record<string, unknown> ? NonNullable<SpreadDefaults<TArgs[Default], TDefaults[Default]>> : TDefaults[Default] | NonNullable<TArgs[Default]> : unknown;
} : never;
/**
 * Defines the Record for the `default` option to add
 * auto-suggestion support for IDE's.
 */
type Defaults<TBooleans extends BooleanType, TStrings extends StringType> = Id<UnionToIntersection<Record<string, unknown> & MapTypes<TStrings, unknown> & MapTypes<TBooleans, unknown> & MapDefaults<TBooleans> & MapDefaults<TStrings>>>;
type MapDefaults<TArgNames extends ArgType> = Partial<Record<TArgNames extends string ? TArgNames : string, unknown>>;
type RecursiveRequired<TRecord> = TRecord extends Record<string, unknown> ? {
    [Key in keyof TRecord]-?: RecursiveRequired<TRecord[Key]>;
} : TRecord;
/** Same as `MapTypes` but also supports collectable options. */
type CollectValues<TArgNames extends ArgType, TType, TCollectable extends Collectable, TNegatable extends Negatable = undefined> = UnionToIntersection<Extract<TArgNames, TCollectable> extends string ? (Exclude<TArgNames, TCollectable> extends never ? Record<never, never> : MapTypes<Exclude<TArgNames, TCollectable>, TType, TNegatable>) & (Extract<TArgNames, TCollectable> extends never ? Record<never, never> : RecursiveRequired<MapTypes<Extract<TArgNames, TCollectable>, Array<TType>, TNegatable>>) : MapTypes<TArgNames, TType, TNegatable>>;
/** Same as `Record` but also supports dotted and negatable options. */
type MapTypes<TArgNames extends ArgType, TType, TNegatable extends Negatable = undefined> = undefined extends TArgNames ? Record<never, never> : TArgNames extends `${infer Name}.${infer Rest}` ? {
    [Key in Name]?: MapTypes<Rest, TType, TNegatable extends `${Name}.${infer Negate}` ? Negate : undefined>;
} : TArgNames extends string ? Partial<Record<TArgNames, TNegatable extends TArgNames ? TType | false : TType>> : Record<never, never>;
type CollectUnknownValues<TBooleans extends BooleanType, TStrings extends StringType, TCollectable extends Collectable, TNegatable extends Negatable> = UnionToIntersection<TCollectable extends TBooleans & TStrings ? Record<never, never> : DedotRecord<Record<Exclude<Extract<Exclude<TCollectable, TNegatable>, string>, Extract<TStrings | TBooleans, string>>, Array<unknown>> & Record<Exclude<Extract<Extract<TCollectable, TNegatable>, string>, Extract<TStrings | TBooleans, string>>, Array<unknown> | false>>>;
/** Converts `{ "foo.bar.baz": unknown }` into `{ foo: { bar: { baz: unknown } } }`. */
type DedotRecord<TRecord> = Record<string, unknown> extends TRecord ? TRecord : TRecord extends Record<string, unknown> ? UnionToIntersection<ValueOf<{
    [Key in keyof TRecord]: Key extends string ? Dedot<Key, TRecord[Key]> : never;
}>> : TRecord;
type Dedot<TKey extends string, TValue> = TKey extends `${infer Name}.${infer Rest}` ? {
    [Key in Name]: Dedot<Rest, TValue>;
} : {
    [Key in TKey]: TValue;
};
type ValueOf<TValue> = TValue[keyof TValue];
/** The value returned from `parse`. */
export type Args<TArgs extends Record<string, unknown> = Record<string, any>, TDoubleDash extends boolean | undefined = undefined> = Id<TArgs & {
    /** Contains all the arguments that didn't have an option associated with
     * them. */
    _: Array<string | number>;
} & (boolean extends TDoubleDash ? DoubleDash : true extends TDoubleDash ? Required<DoubleDash> : Record<never, never>)>;
type DoubleDash = {
    /** Contains all the arguments that appear after the double dash: "--". */
    "--"?: Array<string>;
};
/** The options for the `parse` call. */
export interface ParseOptions<TBooleans extends BooleanType = BooleanType, TStrings extends StringType = StringType, TCollectable extends Collectable = Collectable, TNegatable extends Negatable = Negatable, TDefault extends Record<string, unknown> | undefined = Record<string, unknown> | undefined, TAliases extends Aliases | undefined = Aliases | undefined, TDoubleDash extends boolean | undefined = boolean | undefined> {
    /**
     * When `true`, populate the result `_` with everything before the `--` and
     * the result `['--']` with everything after the `--`.
     *
     * @default {false}
     *
     *  @example
     * ```ts
     * // $ deno run example.ts -- a arg1
     * import { parse } from "https://deno.land/std@$STD_VERSION/flags/mod.ts";
     * console.dir(parse(Deno.args, { "--": false }));
     * // output: { _: [ "a", "arg1" ] }
     * console.dir(parse(Deno.args, { "--": true }));
     * // output: { _: [], --: [ "a", "arg1" ] }
     * ```
     */
    "--"?: TDoubleDash;
    /**
     * An object mapping string names to strings or arrays of string argument
     * names to use as aliases.
     */
    alias?: TAliases;
    /**
     * A boolean, string or array of strings to always treat as booleans. If
     * `true` will treat all double hyphenated arguments without equal signs as
     * `boolean` (e.g. affects `--foo`, not `-f` or `--foo=bar`).
     *  All `boolean` arguments will be set to `false` by default.
     */
    boolean?: TBooleans | ReadonlyArray<Extract<TBooleans, string>>;
    /** An object mapping string argument names to default values. */
    default?: TDefault & Defaults<TBooleans, TStrings>;
    /**
     * When `true`, populate the result `_` with everything after the first
     * non-option.
     */
    stopEarly?: boolean;
    /** A string or array of strings argument names to always treat as strings. */
    string?: TStrings | ReadonlyArray<Extract<TStrings, string>>;
    /**
     * A string or array of strings argument names to always treat as arrays.
     * Collectable options can be used multiple times. All values will be
     * collected into one array. If a non-collectable option is used multiple
     * times, the last value is used.
     * All Collectable arguments will be set to `[]` by default.
     */
    collect?: TCollectable | ReadonlyArray<Extract<TCollectable, string>>;
    /**
     * A string or array of strings argument names which can be negated
     * by prefixing them with `--no-`, like `--no-config`.
     */
    negatable?: TNegatable | ReadonlyArray<Extract<TNegatable, string>>;
    /**
     * A function which is invoked with a command line parameter not defined in
     * the `options` configuration object. If the function returns `false`, the
     * unknown option is not added to `parsedArgs`.
     */
    unknown?: (arg: string, key?: string, value?: unknown) => unknown;
}
/** Take a set of command line arguments, optionally with a set of options, and
 * return an object representing the flags found in the passed arguments.
 *
 * By default, any arguments starting with `-` or `--` are considered boolean
 * flags. If the argument name is followed by an equal sign (`=`) it is
 * considered a key-value pair. Any arguments which could not be parsed are
 * available in the `_` property of the returned object.
 *
 * By default, the flags module tries to determine the type of all arguments
 * automatically and the return type of the `parse` method will have an index
 * signature with `any` as value (`{ [x: string]: any }`).
 *
 * If the `string`, `boolean` or `collect` option is set, the return value of
 * the `parse` method will be fully typed and the index signature of the return
 * type will change to `{ [x: string]: unknown }`.
 *
 * Any arguments after `'--'` will not be parsed and will end up in `parsedArgs._`.
 *
 * Numeric-looking arguments will be returned as numbers unless `options.string`
 * or `options.boolean` is set for that argument name.
 *
 * @example
 * ```ts
 * import { parse } from "https://deno.land/std@$STD_VERSION/flags/mod.ts";
 * const parsedArgs = parse(Deno.args);
 * ```
 *
 * @example
 * ```ts
 * import { parse } from "https://deno.land/std@$STD_VERSION/flags/mod.ts";
 * const parsedArgs = parse(["--foo", "--bar=baz", "./quux.txt"]);
 * // parsedArgs: { foo: true, bar: "baz", _: ["./quux.txt"] }
 * ```
 */
export declare function parse<TArgs extends Values<TBooleans, TStrings, TCollectable, TNegatable, TDefaults, TAliases>, TDoubleDash extends boolean | undefined = undefined, TBooleans extends BooleanType = undefined, TStrings extends StringType = undefined, TCollectable extends Collectable = undefined, TNegatable extends Negatable = undefined, TDefaults extends Record<string, unknown> | undefined = undefined, TAliases extends Aliases<TAliasArgNames, TAliasNames> | undefined = undefined, TAliasArgNames extends string = string, TAliasNames extends string = string>(args: string[], { "--": doubleDash, alias, boolean, default: defaults, stopEarly, string, collect, negatable, unknown, }?: ParseOptions<TBooleans, TStrings, TCollectable, TNegatable, TDefaults, TAliases, TDoubleDash>): Args<TArgs, TDoubleDash>;
export {};
