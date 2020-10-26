export const pattern_unless_preserved = (
  label: string,
  preserved: Array<string>
) => {
  return {
    $pattern: [label, `^(?!(${preserved.join("|")})$)`],
  }
}
