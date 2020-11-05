import { inspect } from "./inspect"

export type Json =
  | string
  | number
  | boolean
  | null
  | Array<Json>
  | { [key: string]: Json }

export type NonNullJson =
  | string
  | number
  | boolean
  | Array<Json>
  | { [key: string]: Json }

export function assert_json_string(data: Json): string {
  if (typeof data === "string") return data
  throw new Error(`Expecting data to be string instead of: ${inspect(data)}.\n`)
}

export function assert_json_number(data: Json): number {
  if (typeof data === "number") return data
  throw new Error(`Expecting data to be number instead of: ${inspect(data)}.\n`)
}

export function assert_json_boolean(data: Json): boolean {
  if (typeof data === "boolean") return data
  throw new Error(
    `Expecting data to be boolean instead of: ${inspect(data)}.\n`
  )
}

export function assert_json_null(data: Json): null {
  if (data === null) return data
  throw new Error(`Expecting data to be null instead of: ${inspect(data)}.\n`)
}

export function assert_json_non_null(data: Json): NonNullJson {
  if (data !== null) return data
  throw new Error(`Expecting data to be not null.\n`)
}

export function assert_json_array(data: Json): Array<Json> {
  if (data instanceof Array) return data
  throw new Error(`Expecting data to be array instead of: ${inspect(data)}.\n`)
}

export function assert_json_object(data: Json): { [key: string]: Json } {
  if (data === null)
    throw new Error(
      `Expecting data to be object instead of null: ${inspect(data)}.\n`
    )
  if (data instanceof Array)
    throw new Error(
      `Expecting data to be object instead of array: ${inspect(data)}.\n`
    )
  if (typeof data === "object") return data

  throw new Error(`Expecting data to be object instead of: ${inspect(data)}.\n`)
}
