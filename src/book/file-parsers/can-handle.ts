export function canHandle(path: string): boolean {
  return path.endsWith(".cic") || path.endsWith(".md")
}
