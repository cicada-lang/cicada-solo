// Old familiar JSON

const { pt } = require("../..")

module.exports = {
  one_or_more: pt.grammars.one_or_more,

  $start: "value",

  value: {
    "value:object": ["object"],
    "value:array": ["array"],
    "value:boolean": ["boolean"],
    "value:null": ["null"],
    "value:string": ["string"],
    "value:number": ["number"],
  },

  object: {
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

  object_entry: {
    "object_entry:key_value_comma": ["string", '":"', "value", '","'],
  },

  array: {
    "array:empty": ['"["', '"]"'],
    "array:one": ['"["', "value", '"]"'],
    "array:more": [
      '"["',
      { $ap: ["one_or_more", "array_entry"] },
      "value",
      '"]"',
    ],
  },

  array_entry: {
    "array_entry:value_comma": ["value", '","'],
  },

  boolean: {
    "boolean:true": ['"true"'],
    "boolean:false": ['"false"'],
  },

  null: {
    "null:null": ['"null"'],
  },

  string: {
    "string:string": [{ $pattern: ["string"] }],
  },

  number: {
    "number:number": [{ $pattern: ["number"] }],
  },
}
