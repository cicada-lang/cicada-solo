use std::sync::Arc;
use std::collections::HashMap;

use crate::exp::Exp;
use crate::env::Env;

#[derive (Clone)]
#[derive (Debug)]
#[derive (PartialEq, Eq)]
pub enum Val {
    Neu { neu: Neu },
    Type {},
    Pi { arg_name: String, arg_type: Arc<Exp>, dep_type_gen: Arc<Exp>,
         env: Env },
    Fn { arg_name: String, arg_type: Arc<Exp>, body: Arc<Exp>,
         env: Env },
    Class { fields: Vec<String>, type_map: HashMap<String, Arc<Exp>>,
            env: Env },
    Object { fields: Vec<String>, val_map: HashMap<String, Arc<Exp>> },
}

#[derive (Clone)]
#[derive (Debug)]
#[derive (PartialEq, Eq)]
pub enum Neu {
    Var { name: String },
    Ap { target: Arc<Neu>, arg: Arc<Exp> },
    Dot { target: Arc<Neu>, field: String },
}
