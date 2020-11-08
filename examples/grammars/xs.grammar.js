// zero or more "x"s -- grammar with epsilon

module.exports = {
  $start: "xs",

  xs: {
    "xs:zero": [],
    "xs:more": ['"x"', "xs"],
  },
}
