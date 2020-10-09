import {one_or_more} from "./one-or-more"

export const dashline = {
  "dashline:dashline": ['"-"', { $ap: ["one_or_more", '"-"'] }],
}
