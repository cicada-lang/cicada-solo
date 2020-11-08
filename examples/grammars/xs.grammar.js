// zero or more "x"s -- grammar with epsilon

module.exports = {
  $start: "xs",

  xs: {
    $grammar: {
      "xs:zero": [],
      "xs:more": ['"x"', "xs"],
    },
  },
}
