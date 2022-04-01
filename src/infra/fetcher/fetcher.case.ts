import { TestCase } from "@xieyuheng/test-case"
import { Fetcher } from "../fetcher"

export default class extends TestCase {
  async "A fetcher can handle http and https by default."() {
    const fetcher = new Fetcher()
    await fetcher.fetch(new URL("http://example.com"))
    await fetcher.fetch(new URL("https://example.com"))
  }

  async "A fetcher can not handler other protocols by default."() {
    const fetcher = new Fetcher()

    this.assertErrorAsync(async () => {
      await fetcher.fetch(new URL("file-store:example-file.txt"))
    })
  }

  async "We can extend a fetcher by registering new handler to protocol."() {
    const fetcher = new Fetcher()
    fetcher.register("echo", (url) => {
      return url.href
    })

    const href = await fetcher.fetch(new URL("echo:abc"))
    this.assertEquals(href, "echo:abc")
  }
}
