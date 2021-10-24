import { CtxEvent } from "./ctx-event"

export abstract class CtxObserver {
  abstract receive(event: CtxEvent): void
}

export class SimpleCtxObserver extends CtxObserver {
  receive: (event: CtxEvent) => void

  constructor(opts: { receive: (event: CtxEvent) => void }) {
    super()
    this.receive = opts.receive
  }

  static create(opts: {
    receive: (event: CtxEvent) => void
  }): SimpleCtxObserver {
    return new SimpleCtxObserver(opts)
  }
}
