export function in_browser_p(): boolean {
  return typeof window === "object"
}
