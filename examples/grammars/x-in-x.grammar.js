// x in x

module.exports = {
  $start: "s",

  s: {
    $grammar: {
      "s:x": ['"x"'],
      "s:x_in_x": ['"x"', "s", '"x"'],
    },
  },
}
