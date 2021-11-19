interface SigmaOptions {
  name: string
  car_t: {
    format(): string
  }
  cdr_t: {
    format(): string
    sigma_formater?: SigmaFormater
  }
}

export class SigmaFormater {
  sigma: SigmaOptions

  constructor(sigma: SigmaOptions) {
    this.sigma = sigma
  }

  format(): string {
    const bindings = this.format_bindings().join(", ")
    const cdr_t = this.format_cdr_t()
    return `[${bindings} | ${cdr_t}]`
  }

  private format_bindings(): Array<string> {
    const binding = `${this.sigma.name}: ${this.sigma.car_t.format()}`

    if (this.sigma.cdr_t.sigma_formater) {
      return [binding, ...this.sigma.cdr_t.sigma_formater.format_bindings()]
    } else {
      return [binding]
    }
  }

  private format_cdr_t(): string {
    if (this.sigma.cdr_t.sigma_formater) {
      return this.sigma.cdr_t.sigma_formater.format_cdr_t()
    } else {
      return this.sigma.cdr_t.format()
    }
  }
}
