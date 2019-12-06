use std::sync::Arc;

use crate::val::Val;

#[derive(Clone)]
#[derive(Debug)]
#[derive(PartialEq, Eq)]
pub enum Neu {
    Var { name: String },
    Ap { target: Arc<Neu>, arg: Arc<Val> },
    Dot { target: Arc<Neu>, field: String },
}
