import "./monkey-patching"

const x: string = "This is an example".toCamelCase()

if (x !== "thisIsAnExample") {
  throw new Error(`x should be "thisIsAnExample" instead of: ${x}`)
}
