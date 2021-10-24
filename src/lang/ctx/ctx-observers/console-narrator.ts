import { CtxEvent, CtxObserver } from "../../ctx"

export class ConsoleNarrator extends CtxObserver {
  receive(event: CtxEvent): void {
    if (event.tag === "narration") {
      console.log(event.msg)
    }
  }
}
