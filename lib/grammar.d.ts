import { Rule } from "@forchange/partech/lib/rule";
import * as AST from "@forchange/partech/lib/tree";
import * as Top from "./top";
export declare function top_list(): Rule;
export declare const top_list_matcher: (tree: AST.Tree) => Top.Top[];
