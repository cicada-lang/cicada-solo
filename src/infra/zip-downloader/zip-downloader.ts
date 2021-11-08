export type ZipResult = {
  path: string
  tag: string
  filename: string
  data: Buffer
}

export abstract class ZipDownloader {
  abstract download(target: string): Promise<ZipResult>
}
