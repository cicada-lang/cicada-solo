import { tester } from "./utilities"

// preserved keywords

tester.not_exp`
implicit
`

tester.exp`
123
`

tester.exp`
"abc"
`

tester.exp`
x
`
