/**
 * Return `true` if metadata passed the integrity check.
 * Return all the missing required fields if metadata failed the integrity check.
 * @param data Project metadata.
 */
export function metadata_integrity_chk(data: {
  [key: string]: any
}): true | string[] {
  let required_field_list = ["project", "version", "input", "output", "main"]
  let result = required_field_list.filter((v) => data[v] === undefined)
  return result.length > 0 ? result : true
}
