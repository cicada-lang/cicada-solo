// NOTE: this is meant to be used alongside with commanderjs.
let cli_options: { [key: string]: any } = {}

export function get_cli_option_dict() {
  return cli_options
}
export function get_cli_option(key: string): any {
  return cli_options[key]
}
export function set_cli_option(key: string, value: any): void {
  cli_options[key] = value
}
export function with_cli_options(...options: string[]) {
  return (f: (...args: any[]) => any) => (...args: any[]) => {
    options.forEach((v) => set_cli_option(v, (args as any)[args.length - 1][v]))
    return f(...args)
  }
}
export function on_cli_option(
  optionKey: string,
  callback: (optionValue: any) => any
) {
  let rec_option_val = get_cli_option(optionKey)
  if (rec_option_val !== undefined) {
    callback(rec_option_val)
  }
}
