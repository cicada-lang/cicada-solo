use std::sync::Arc;
use std::collections::HashMap;

use crate::exp::Exp;
use crate::val::Val;
use crate::neu::Neu;
use crate::env::Env;
use crate::error::Error;

pub fn eval(env: &Env, exp: &Exp) -> Result<Arc<Val>, Error> {
    match exp {
        Exp::Var { name } => {
            match env.lookup_val(name) {
                Some(val) => { Ok(val.clone()) }
                None => {
                    Ok(Arc::new(Val::Neu {
                        neu: Neu::Var {
                            name: name.clone()
                        }
                    }))
                }
            }
        }
        Exp::Type {} => {
            Ok(Arc::new(Val::Type {}))
        }
        Exp::Pi { arg_name, arg_type, ret_type } => {
            Ok(Arc::new(Val::Pi {
                arg_name: arg_name.clone(),
                arg_type: arg_type.clone(),
                ret_type: ret_type.clone(),
                env: env.clone(),
            }))
        }
        Exp::Fn { arg_name, arg_type, body } => {
            Ok(Arc::new(Val::Fn {
                arg_name: arg_name.clone(),
                arg_type: arg_type.clone(),
                body: body.clone(),
                env: env.clone(),
            }))
        }
        Exp::Ap { target, arg } => {
            match eval(env, target)?.as_ref() {
                Val::Neu { neu } => {
                    Ok(Arc::new(Val::Neu {
                        neu: Neu::Ap {
                            target: Arc::new(neu.clone()),
                            arg: eval(env, arg)?,
                        }
                    }))
                }
                val => {
                    val_ap(val, eval(env, arg)?.as_ref())
                }
            }
        }
        Exp::Class { fields, type_map } => {
            Ok(Arc::new(Val::Class {
                fields: fields.clone(),
                type_map: type_map.clone(),
                env: env.clone(),
            }))
        }
        Exp::Object { fields, val_map } => {
            let mut new_val_map = HashMap::new();
            for (field, exp) in val_map.iter() {
                new_val_map.insert(field.clone(), eval(env, exp)?);
            }
            Ok(Arc::new(Val::Object {
                fields: fields.clone(),
                val_map: new_val_map,
            }))
        }
        Exp::Dot { target, field } => {
            match eval(env, target)?.as_ref() {
                Val::Neu { neu } => {
                    Ok(Arc::new(Val::Neu {
                        neu: Neu::Dot {
                            target: Arc::new(neu.clone()),
                            field: field.clone(),
                        }
                    }))
                }
                val => {
                    val_dot(val, &field)
                }
            }
        }
    }
}

pub fn val_ap(val: &Val, arg: &Val) -> Result<Arc<Val>, Error> {
    match val {
        Val::Fn { arg_name, body, env, .. } => {
            eval(&env.ext(arg_name.clone(), Arc::new(arg.clone())), body)
        }
        _ => {
            Err(Error {
                msg: String::from(format!(
                    "expecting Val::Fn, but found: {:?}", val
                )),
            })
        }
    }
}

pub fn val_dot(val: &Val, field: &String) -> Result<Arc<Val>, Error> {
    match val {
        Val::Object { val_map, .. } => {
            match val_map.get(field) {
                Some(val) => {
                    Ok(val.clone())
                }
                None => {
                    Err(Error {
                        msg: String::from(format!(
                            "undefined field: {:?}", field
                        )),
                    })
                }
            }
        }
        _ => {
            Err(Error {
                msg: String::from(format!(
                    "expecting Val::Object, but found: {:?}", val
                )),
            })
        }
    }
}

#[test]
fn test_eval() {
    let env = Env::new();
    let exp = Exp::Var { name: String::from("x") };

    println!("{:?}", eval(&env, &exp));
}
