use std::sync::Arc;
use std::collections::HashMap;

#[derive(Clone)]
#[derive(Debug)]
#[derive(PartialEq, Eq)]
pub enum Exp {
    Var { name: String },
    Type {},
    Pi { arg_name: String, arg_type: Arc<Exp>, ret_type: Arc<Exp> },
    Fn { arg_name: String, arg_type: Arc<Exp>, body: Arc<Exp> },
    Ap { target: Arc<Exp>, arg: Arc<Exp> },
    Class { fields: Vec<String>, type_map: HashMap<String, Arc<Exp>> },
    Object { fields: Vec<String>, val_map: HashMap<String, Arc<Exp>> },
    Dot { target: Arc<Exp>, field: String },
}
