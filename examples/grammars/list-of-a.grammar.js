// list of a -- grammar with epsilon

module.exports = {
  $start: "list_of_a",

  list_of_a: {
    "list_of_a:list": ['"["', "aaa", '"]"'],
  },

  aaa: {
    "aaa:zero": [],
    "aaa:more": ['"a"', "aaa"],
  },
}
