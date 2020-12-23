export type VarNeutral = {
  kind: "Neutral.v"
  name: string
}

export function VarNeutral(name: string): VarNeutral {
  return {
    kind: "Neutral.v",
    name,
  }
}
