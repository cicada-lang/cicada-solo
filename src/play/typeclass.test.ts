import * as ut from "../ut"

type Show<T> = {
  show: (x: T) => string
}

const string_shower: Show<string> = {
  show: (x: string) => x.toUpperCase(),
}

ut.assert_equal(string_shower.show("abc"), "ABC")
