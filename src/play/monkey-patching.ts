interface String {
  toCamelCase(): string
}

String.prototype.toCamelCase = function (): string {
  return this.replace(/[^a-z ]/gi, "").replace(
    /(?:^\w|[A-Z]|\b\w|\s+)/g,
    (match: any, index: number) => {
      return +match === 0
        ? ""
        : match[index === 0 ? "toLowerCase" : "toUpperCase"]()
    }
  )
}
