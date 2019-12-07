#[derive(Clone)]
#[derive(Debug)]
#[derive(PartialEq, Eq)]
pub struct Rule {
    pub name: String,
    pub choices: Vec<(String, Vec<Symbol>)>,
}

impl Rule {
    pub fn new(
        name: &str,
        choices: Vec<(&str, Vec<Symbol>)>,
    ) -> Rule {
        let mut cloned_choices = Vec::new();
        for (choice_name, symbols) in choices {
            cloned_choices.push((String::from(choice_name), symbols));
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
pub enum Symbol {
    Word(String),
    Rule(Rule),
    Fn(fn () -> Rule),
    Ap(fn (Vec<Symbol>) -> Rule, Vec<Symbol>),
    WordPred(WordPred),
}

impl Symbol {
    pub fn word(word: &'static str) -> Symbol {
        Symbol::Word(String::from(word))
    }
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
            ("fn", vec![Symbol::word("fn")]),
            ("ap", vec![Symbol::Fn(exp1)]),
        ])
    }

    fn exp2() -> Rule {
        Rule::new("exp2", vec![
            ("fn", vec![Symbol::word("fn")]),
            ("ap", vec![Symbol::Fn(exp2)]),
        ])
    }

    assert_eq!(exp1(), exp1());
    assert_ne!(exp1(), exp2());

    assert_eq!(
        Symbol::Ap(non_empty_list, vec![Symbol::Fn(exp1)]),
        Symbol::Ap(non_empty_list, vec![Symbol::Fn(exp1)]));
    assert_ne!(
        Symbol::Ap(non_empty_list, vec![Symbol::Fn(exp1)]),
        Symbol::Ap(non_empty_list, vec![Symbol::Fn(exp2)]));
}
