import "./string-to-camel-case"
import * as ut from "../../ut"

const x: string = "This is an example".toCamelCase()

ut.assert_equal(x, "thisIsAnExample")
