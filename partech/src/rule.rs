#[derive(Clone)]
#[derive(Debug)]
#[derive(PartialEq, Eq)]
pub struct Rule {
    pub name: String,
    pub choices: Vec<(String, Vec<Sym>)>,
}

impl Rule {
    pub fn new(
        name: &str,
        choices: Vec<(&str, Vec<Sym>)>,
    ) -> Rule {
        let mut cloned_choices = Vec::new();
        for (choice_name, syms) in choices {
            cloned_choices.push((String::from(choice_name), syms));
        }
        Rule {
            name: String::from(name),
            choices: cloned_choices,
        }
    }
}

#[derive(Clone)]
#[derive(Debug)]
#[derive(PartialEq, Eq)]
pub enum Sym {
    Str(String),
    Rule(Rule),
    Fn(fn () -> Rule),
    Ap(fn (Vec<Sym>) -> Rule, Vec<Sym>),
    WordPred(WordPred),
}

#[derive(Clone)]
#[derive(Debug)]
#[derive(PartialEq, Eq)]
pub struct WordPred {
    pub name: String,
    pub pred: fn (String) -> bool,
}

#[test]
fn test_rule_equality() {
    use crate::predefined::non_empty_list;

    fn exp1() -> Rule {
        Rule::new("exp1", vec![
            ("fn", vec![]),
            ("ap", vec![Sym::Fn(exp1)]),
        ])
    }

    fn exp2() -> Rule {
        Rule::new("exp2", vec![
            ("fn", vec![]),
            ("ap", vec![Sym::Fn(exp2)]),
        ])
    }

    assert_eq!(exp1(), exp1());
    assert_ne!(exp1(), exp2());

    assert_eq!(
        Sym::Ap(non_empty_list, vec![Sym::Fn(exp1)]),
        Sym::Ap(non_empty_list, vec![Sym::Fn(exp1)]));
    assert_ne!(
        Sym::Ap(non_empty_list, vec![Sym::Fn(exp1)]),
        Sym::Ap(non_empty_list, vec![Sym::Fn(exp2)]));
}
