// Old familiar JSON

const { pt } = require("../..")

module.exports = {
  one_or_more: pt.grammars.one_or_more,

  $start: "value",

  value: {
    $grammar: {
      "value:object": ["object"],
      "value:array": ["array"],
      "value:boolean": ["boolean"],
      "value:null": ["null"],
      "value:string": ["string"],
      "value:number": ["number"],
    },
  },

  object: {
    $grammar: {
      "object:empty": ['"{"', '"}"'],
      "object:one": ['"{"', "string", '":"', "value", '"}"'],
      "object:more": [
        '"{"',
        { $ap: ["one_or_more", "object_entry"] },
        "string",
        '":"',
        "value",
        '"}"',
      ],
    },
  },

  object_entry: {
    $grammar: {
      "object_entry:key_value_comma": ["string", '":"', "value", '","'],
    },
  },

  array: {
    $grammar: {
      "array:empty": ['"["', '"]"'],
      "array:one": ['"["', "value", '"]"'],
      "array:more": [
        '"["',
        { $ap: ["one_or_more", "array_entry"] },
        "value",
        '"]"',
      ],
    },
  },

  array_entry: {
    $grammar: {
      "array_entry:value_comma": ["value", '","'],
    },
  },

  boolean: {
    $grammar: {
      "boolean:true": ['"true"'],
      "boolean:false": ['"false"'],
    },
  },

  null: {
    $grammar: {
      "null:null": ['"null"'],
    },
  },

  string: {
    $grammar: {
      "string:string": [{ $pattern: ["string"] }],
    },
  },

  number: {
    $grammar: {
      "number:number": [{ $pattern: ["number"] }],
    },
  },
}
