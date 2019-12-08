use std::sync::Arc;
use std::collections::HashMap;

use crate::val::Val;

#[derive(Clone)]
#[derive(Debug)]
#[derive(PartialEq, Eq)]
pub struct Env {
    val_map: HashMap<String, Arc<Val>>
}

impl Env {
    pub fn new() -> Env {
        let val_map = HashMap::new();
        Env { val_map }
    }

    pub fn lookup_val(&self, field: &String) -> Option<Arc<Val>> {
        match self.val_map.get(field) {
            Some(val) => {
                Some(val.clone())
            }
            None => {
                None
            }
        }
    }

    pub fn ext(&self, name: String, val: Arc<Val>) -> Env {
        let mut val_map = self.val_map.clone();
        val_map.insert(name, val);
        Env { val_map }
    }
}
