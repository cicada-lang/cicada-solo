import { tester } from "../parser-tester-instance"

// NOTE preserved keywords

tester.not_exp(`implicit`)

tester.echo_exp(`123`)
tester.echo_exp(`"abc"`)
tester.echo_exp(`x`)
