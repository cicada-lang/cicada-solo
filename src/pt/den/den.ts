export type Den = token

interface token {
  kind: "Den.token"
  pattern: string | RegExp
}

export const token = (pattern: string | RegExp): token => ({
  kind: "Den.token",
  pattern,
})
