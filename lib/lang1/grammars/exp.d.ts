import * as Exp from "../exp";
import * as Ty from "../ty";
import pt from "@forchange/partech";
export declare function ty(): pt.Sym.Rule;
export declare function ty_matcher(tree: pt.Tree.Tree): Ty.Ty;
export declare function exp(): pt.Sym.Rule;
export declare function exp_matcher(tree: pt.Tree.Tree): Exp.Exp;
export declare function exp_in_paren_matcher(tree: pt.Tree.Tree): Exp.Exp;
export declare function def_matcher(tree: pt.Tree.Tree): {
    name: string;
    exp: Exp.Exp;
};
