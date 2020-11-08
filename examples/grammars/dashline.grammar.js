// line of more then one dashes

const { pt } = require("../..")

module.exports = {
  one_or_more: pt.grammars.one_or_more,

  $start: "dashline",

  dashline: {
    $grammar: {
      "dashline:dashline": ['"-"', { $ap: ["one_or_more", '"-"'] }],
    },
  },
}
