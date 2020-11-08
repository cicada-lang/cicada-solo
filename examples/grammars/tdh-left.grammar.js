// tdh_left -- left regular grammar

module.exports = {
  $start: "tdh",

  tdh: {
    $grammar: {
      "tdh:t": ['"t"'],
      "tdh:d": ['"d"'],
      "tdh:h": ['"h"'],
      "tdh:list": ["tdh_list"],
    },
  },

  tdh_list: {
    $grammar: {
      "tdh_list:t": ["tdh_list_head", '"&"', '"t"'],
      "tdh_list:d": ["tdh_list_head", '"&"', '"d"'],
      "tdh_list:h": ["tdh_list_head", '"&"', '"h"'],
    },
  },

  tdh_list_head: {
    $grammar: {
      "tdh_list_head:t": ['"t"'],
      "tdh_list_head:d": ['"d"'],
      "tdh_list_head:h": ['"h"'],
      "tdh_list_head:before_t": ["tdh_list_head", '","', '"t"'],
      "tdh_list_head:before_d": ["tdh_list_head", '","', '"d"'],
      "tdh_list_head:before_h": ["tdh_list_head", '","', '"h"'],
    },
  },
}
