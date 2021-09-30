export abstract class FileResource {
  abstract keys(): Promise<Array<string>>
  abstract get(path: string): Promise<string>

  async all(): Promise<Record<string, string>> {
    const files: Record<string, string> = {}
    for (const path of await this.keys()) {
      files[path] = await this.get(path)
    }

    return files
  }
}
