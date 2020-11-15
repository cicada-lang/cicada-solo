export const modpath = {
  $grammar: {
    "modpath:modpath": [
      { prefix: { $ap: ["zero_or_more", "modpath_entry"] } },
      { name: "identifier" },
    ],
  },
}

export const modpath_entry = {
  $grammar: {
    "modpath_entry:modpath_entry": [{ name: "identifier" }, '"."'],
  },
}
