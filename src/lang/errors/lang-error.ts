export class LangError extends Error {
  constructor(public message: string) {
    super(message)
  }
}
