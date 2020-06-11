import * as Sexp from "../sexp"

export function repr(sexp: Sexp.Sexp): string {
  if (typeof sexp === "string") {
    return sexp
  } else {
    return `(${sexp.map(repr).join(" ")})`
  }
}
