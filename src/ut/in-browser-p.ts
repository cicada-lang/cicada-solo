// NOTE
// https://stackoverflow.com/questions/34550890/how-to-detect-if-script-is-running-in-browser-or-in-node-js

export function in_browser_p(): boolean {
  return typeof window === "object"
}
