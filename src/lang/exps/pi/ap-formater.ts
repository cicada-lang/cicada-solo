interface ApOptions {
  target: {
    format(): string
    ap_formater?: ApFormater
  }
  arg: {
    format(): string
  }
}

export class ApFormater {
  ap: ApOptions
  decorate_arg?(arg: string): string

  constructor(
    ap: ApOptions,
    opts?: {
      decorate_arg(arg: string): string
    }
  ) {
    this.ap = ap
    this.decorate_arg = opts?.decorate_arg
  }

  private format_args(): Array<string> {
    const arg = this.decorate_arg
      ? this.decorate_arg(this.ap.arg.format())
      : this.ap.arg.format()

    if (this.ap.target.ap_formater) {
      return [...this.ap.target.ap_formater.format_args(), arg]
    } else {
      return [arg]
    }
  }

  private format_target(): string {
    if (this.ap.target.ap_formater) {
      return this.ap.target.ap_formater.format_target()
    } else {
      return this.ap.target.format()
    }
  }

  format(): string {
    const target = this.format_target()
    const args = this.format_args().join(", ")
    return `${target}(${args})`
  }
}
