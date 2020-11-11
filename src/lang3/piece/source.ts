export type Source = file | repl

export type file = {
  kind: "file"
  name: string
}

export type repl = {
  kind: "repl"
}
