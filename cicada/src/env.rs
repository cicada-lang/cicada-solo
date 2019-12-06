use std::sync::Arc;
use std::collections::HashMap;

use crate::val::Val;

#[derive (Clone)]
#[derive (Debug)]
#[derive (PartialEq, Eq)]
pub struct Env {
    val_map: HashMap<String, Arc<Val>>
}
