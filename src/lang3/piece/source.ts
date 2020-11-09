export type Source = file | relp

export interface file {
  kind: "file"
  name: string
}

export interface relp {
  kind: "repl"
}
