type Handler = (url: URL) => string | Promise<string>

export class Fetcher {
  private handlers: Record<string, Handler>

  constructor() {
    this.handlers = {}
    this.register("http", httpHandler)
    this.register("https", httpHandler)
  }

  get knownProtocols(): Array<string> {
    return Object.keys(this.handlers)
  }

  async fetch(url: URL): Promise<string> {
    const handler = this.handlers[url.protocol]
    if (handler === undefined) {
      throw new Error(
        [
          `I can not handle protocol: ${JSON.stringify(url.protocol)},`,
          `  known protocols are: ${JSON.stringify(this.knownProtocols)}`,
        ].join("\n"),
      )
    }

    return await handler(url)
  }

  register(protocol: string, handler: Handler): this {
    if (!protocol.endsWith(":")) protocol += ":"
    this.handlers[protocol] = handler
    return this
  }
}

async function httpHandler(url: URL): Promise<string> {
  const response = await fetch(url.href)
  return await response.text()
}
