// list of a -- grammar with epsilon

module.exports = {
  $start: "list_of_a",

  list_of_a: {
    $grammar: {
      "list_of_a:list": ['"["', "aaa", '"]"'],
    },
  },

  aaa: {
    $grammar: {
      "aaa:zero": [],
      "aaa:more": ['"a"', "aaa"],
    },
  },
}
