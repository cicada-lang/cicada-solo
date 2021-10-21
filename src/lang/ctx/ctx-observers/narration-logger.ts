import { CtxEvent, CtxObserver } from "../ctx"

export class NarrationLogger extends CtxObserver {
  receive(event: CtxEvent): void {
    if (event.tag === "narration") {
      console.log(event.msg)
    }
  }
}
