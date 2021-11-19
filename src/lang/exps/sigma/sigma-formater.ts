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
    const cars = this.sigma_cars_format().join(", ")
    const cdr_t = this.sigma_cdr_t_format()
    return `[${cars} | ${cdr_t}]`
  }

  sigma_cars_format(): Array<string> {
    const binding = `${this.sigma.name}: ${this.sigma.car_t.format()}`

    if (this.sigma.cdr_t.sigma_formater) {
      return [binding, ...this.sigma.cdr_t.sigma_formater.sigma_cars_format()]
    } else {
      return [binding]
    }
  }

  sigma_cdr_t_format(): string {
    if (this.sigma.cdr_t.sigma_formater) {
      return this.sigma.cdr_t.sigma_formater.sigma_cdr_t_format()
    } else {
      return this.sigma.cdr_t.format()
    }
  }
}
