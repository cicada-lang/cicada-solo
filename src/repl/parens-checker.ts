export abstract class ParensChecker {
  abstract depth(text: string): number
  abstract check(text: string): ParensCheckResult
  abstract report_error(error: Error): void
}

type ParensCheckResult = { kind: "balance" } | { kind: "lack" } | Error
