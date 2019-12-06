#![allow (dead_code)]

// use std::fmt;
use std::sync::Arc;
use std::collections::HashMap;

#[derive (Clone)]
#[derive (Debug)]
#[derive (PartialEq, Eq)]
pub enum Exp {
    Var { name: String },
    Type {},
    Pi { arg_name: String, arg_type: Arc<Exp>, dep_type_gen: Arc<Exp> },
    Fn { arg_name: String, arg_type: Arc<Exp>, body: Arc<Exp> },
    Ap { target: Arc<Exp>, arg: Arc<Exp> },
    Class { fields: Vec<String>, type_map: HashMap<String, Arc<Exp>> },
    Object { fields: Vec<String>, val_map: HashMap<String, Arc<Exp>> },
    Dot { target: Arc<Exp>, field: String },
}

#[derive (Clone)]
#[derive (Debug)]
#[derive (PartialEq, Eq)]
pub struct Env {
    val_map: HashMap<String, Arc<Val>>
}

#[derive (Clone)]
#[derive (Debug)]
#[derive (PartialEq, Eq)]
pub struct Ctx {
    type_map: HashMap<String, Arc<Val>>
}

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

pub fn eval(env: &Env, exp: &Exp) -> Val {
    match exp {
        Exp::Var { name } => {
            Val::Neu { neu: Neu::Var { name: name.to_string() } }
        }
        Exp::Type {} => {
            Val::Type {}
        }
        Exp::Pi { arg_name, arg_type, dep_type_gen } => {
            unimplemented!()
        }
        Exp::Fn { arg_name, arg_type, body } => {
            unimplemented!()
        }
        Exp::Ap { target, arg } => {
            unimplemented!()
        }
        Exp::Class { fields, type_map } => {
            unimplemented!()
        }
        Exp::Object { fields, val_map } => {
            unimplemented!()
        }
        Exp::Dot { target, field } => {
            unimplemented!()
        }
    }
}
