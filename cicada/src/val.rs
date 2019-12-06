use std::sync::Arc;
use std::collections::HashMap;

use crate::exp::Exp;
use crate::env::Env;
use crate::neu::Neu;

#[derive(Clone)]
#[derive(Debug)]
#[derive(PartialEq, Eq)]
pub enum Val {
    Neu { neu: Neu },
    Type {},
    Pi { arg_name: String, arg_type: Arc<Exp>, ret_type: Arc<Exp>,
         env: Env },
    Fn { arg_name: String, arg_type: Arc<Exp>, body: Arc<Exp>,
         env: Env },
    Class { fields: Vec<String>, type_map: HashMap<String, Arc<Exp>>,
            env: Env },
    Object { fields: Vec<String>, val_map: HashMap<String, Arc<Val>> },
}
