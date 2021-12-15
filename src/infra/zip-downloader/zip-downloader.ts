export type ZipResult = {
  path: string
  tag: string
  filename: string
  data: Buffer
}

// NOTE Example targets:
// - xieyuheng/mathematical-structures@0.0.1
export abstract class ZipDownloader {
  abstract download(target: string): Promise<ZipResult>
}
