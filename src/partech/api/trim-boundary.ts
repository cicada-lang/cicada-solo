export function trim_boundary(str: string, n: number): string {
  return str.slice(n, str.length - n)
}
