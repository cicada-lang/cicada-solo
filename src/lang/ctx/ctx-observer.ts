export interface CtxEvent {
  tag: string
  msg: string
}

export interface CtxObserver {
  receive(event: CtxEvent): void
}
