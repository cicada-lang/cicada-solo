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
    const typings = this.format_typings().join(", ")
    const cdr_t = this.format_cdr_t()
    return `exists (${typings}) ${cdr_t}`
  }

  private format_typings(): Array<string> {
    const typing = `${this.sigma.name}: ${this.sigma.car_t.format()}`

    if (this.sigma.cdr_t.sigma_formater) {
      return [typing, ...this.sigma.cdr_t.sigma_formater.format_typings()]
    } else {
      return [typing]
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
