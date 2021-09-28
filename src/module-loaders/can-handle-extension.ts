export function can_handle_extension(path: string): boolean {
  return path.endsWith(".cic") || path.endsWith(".md")
}
