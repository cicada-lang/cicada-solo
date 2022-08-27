interface LetOptions {
  name: string
  exp: {
    format(): string
  }
  ret: {
    format(): string
    let_formater?: LetFormater
  }
}

export class LetFormater {
  target: LetOptions

  constructor(target: LetOptions) {
    this.target = target
  }

  format(): string {
    const typings = this.format_typings().join("; ")
    const ret = this.format_ret()
    return `${typings}; ${ret}`
  }

  format_typings(): Array<string> {
    const typing = `${this.target.name} = ${this.target.exp.format()}`

    if (this.target.ret.let_formater) {
      return [typing, ...this.target.ret.let_formater.format_typings()]
    } else {
      return [typing]
    }
  }

  format_ret(): string {
    if (this.target.ret.let_formater) {
      return this.target.ret.let_formater.format_ret()
    } else {
      return `return ${this.target.ret.format()}`
    }
  }
}
