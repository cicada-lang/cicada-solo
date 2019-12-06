use std::collections::HashMap;

use crate::rule::{ Rule, Sym };

pub fn non_empty_list(args: Vec<Sym>) -> Rule {
    Rule::new("non_empty_list", vec![
        ("one", vec![args[0].clone()]),
        ("more", vec![args[0].clone(), Sym::Ap(non_empty_list, args)]),
    ])
}
