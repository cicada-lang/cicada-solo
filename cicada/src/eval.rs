use crate::exp::Exp;
use crate::val::Val;
use crate::neu::Neu;
use crate::env::Env;

// TODO
#[allow(unused_variables)]

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
