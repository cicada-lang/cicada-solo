#[derive(Hash)]
#[derive(Clone)]
#[derive(Debug)]
#[derive(PartialEq, Eq)]
pub struct Rule<'a> {
    pub name: &'a str,
    pub choices: Vec<(&'a str, Vec<Symbol<'a>>)>,
}

#[derive(Hash)]
#[derive(Clone)]
#[derive(Debug)]
#[derive(PartialEq, Eq)]
pub enum Symbol<'a> {
    Word(&'a str),
    Rule(&'a Rule<'a>),
    Fn(fn () -> Rule<'a>),
    Ap(fn (&'a Vec<Symbol<'a>>) -> Rule, &'a Vec<Symbol<'a>>),
    WordPred(&'a WordPred<'a>),
}

impl <'a> Symbol<'a> {
    pub fn terminal_p(&self) -> bool {
        match self {
            Symbol::Word(_) => { true }
            Symbol::WordPred(_) => { true }
            _ => { false }
        }
    }

    pub fn non_terminal_p(&self) -> bool {
        !self.terminal_p()
    }

    pub fn terminal_match(&self, word: &'a str) -> bool {
        match self {
            Symbol::Word(word2) => { &word == word2 }
            Symbol::WordPred(word_pred) => { (word_pred.pred)(word) }
            _ => {
                panic!("terminal_match should not be called on non terminal");
            }
        }
    }

    pub fn non_terminal_to_rule(&self) -> Rule<'a> {
        match self {
            Symbol::Rule(rule) => { (*rule).clone() }
            Symbol::Fn(f) => { f() }
            Symbol::Ap(f, args) => { f(args) }
            _ => {
                panic!("non_terminal_to_rule should not be called on terminal");
            }
        }
    }
}

#[derive(Hash)]
#[derive(Clone)]
#[derive(Debug)]
#[derive(PartialEq, Eq)]
pub struct WordPred <'a> {
    pub name: &'a str,
    pub pred: fn (&'a str) -> bool,
}



#[test]
fn test_rule_equality() {
    use crate::predefined::non_empty_list;

    fn exp1<'a>() -> Rule<'a> {
        Rule {
            name: "exp1",
            choices: vec![
                ("fn", vec![Symbol::Word("fn")]),
                ("ap", vec![Symbol::Fn(exp1)]),
            ]
        }
    }

    fn exp2<'a>() -> Rule<'a> {
        Rule {
            name: "exp2",
            choices: vec![
                ("fn", vec![Symbol::Word("fn")]),
                ("ap", vec![Symbol::Fn(exp2)]),
            ]
        }
    }

    assert_eq!(exp1(), exp1());
    assert_ne!(exp1(), exp2());

    assert_eq!(
        Symbol::Ap(non_empty_list, &vec![Symbol::Fn(exp1)]),
        Symbol::Ap(non_empty_list, &vec![Symbol::Fn(exp1)]));
    assert_ne!(
        Symbol::Ap(non_empty_list, &vec![Symbol::Fn(exp1)]),
        Symbol::Ap(non_empty_list, &vec![Symbol::Fn(exp2)]));
}
