use std::collections::HashSet;

use crate::rule::{ Rule, Symbol };
use crate::lexer::Lexer;
use crate::util;

pub fn non_empty_list<'a>(args: &'a Vec<Symbol<'a>>) -> Rule<'a> {
    Rule {
        name: "non_empty_list",
        choices: vec![
            ("one", vec![args[0].clone()]),
            ("more", vec![args[0].clone(), Symbol::Ap(non_empty_list, args)]),
        ]
    }
}

pub fn space_char_set() -> HashSet<char> {
    vec![
        ' ', '\n', '\t'
    ].into_iter().collect()
}

pub fn punctuation_char_set() -> HashSet<char> {
    vec![
        '=', ':', '.', ',', ';',
        '~', '!', '@', '#', '$', '%', '^', '&', '*',  '-', '+',
        '<', '>',
        '(', ')',
        '[', ']',
        '{', '}',
    ].into_iter().collect()
}

pub fn ignore_one_space<'a>(text: &'a str) -> Option<&'a str> {
    match text.chars().next() {
        Some(c) => {
            if space_char_set().contains(&c) {
                text.get(c.len_utf8()..)
            } else {
                None
            }
        }
        None => {
            None
        }
    }
}

pub fn ignore_one_line_comment<'a>(text: &'a str) -> Option<&'a str> {
    if text.starts_with("//") {
        match text.find('\n') {
            Some(i) => {
                text.get(i..)
            }
            None => {
                Some("")
            }
        }
    } else {
        None
    }
}

pub fn ignore_space_and_line_comment<'a>(text: &'a str) -> &'a str {
    let mut remain = text;
    let mut continue_p = true;
    while continue_p {
        match ignore_one_space(remain) {
            Some(s) => {
                remain = s;
            }
            None => {
                match ignore_one_line_comment(remain) {
                    Some(s) => {
                        remain = s;
                    }
                    None => {
                        continue_p = false;
                    }
                }
            }
        }
    }
    remain
}

pub fn word_matcher<'a>(text: &'a str) -> Option<(&'a str, &'a str)> {
    match text.chars().next() {
        Some(c) => {
            if punctuation_char_set().contains(&c) {
                Some(text.split_at(c.len_utf8()))
            } else {
                fn char_pred(c: char) -> bool {
                    space_char_set().contains(&c) ||
                        punctuation_char_set().contains(&c)
                }
                match util::str_split_by_char_pred(text, char_pred) {
                    Some((left, right)) => {
                        Some((left, right))
                    }
                    None => {
                        Some((text, ""))
                    }
                }
            }
        }
        None => {
            None
        }
    }
}

pub fn word_matcher_with_string<'a>(text: &'a str) -> Option<(&'a str, &'a str)> {
    match text.chars().next() {
        Some('"') => {
            match text[1..].find('"') {
                Some(i) => {
                    // not +1 but +2
                    // because the `i` is calculated for `rest` not `text`
                    Some(text.split_at(i+2))
                }
                None => {
                    // doublequote mismatch
                    None
                }
            }
        }
        Some(c) => {
            if punctuation_char_set().contains(&c) {
                Some(text.split_at(c.len_utf8()))
            } else {
                fn char_pred(c: char) -> bool {
                    space_char_set().contains(&c) ||
                        punctuation_char_set().contains(&c)
                }
                match util::str_split_by_char_pred(text, char_pred) {
                    Some((left, right)) => {
                        Some((left, right))
                    }
                    None => {
                        Some((text, ""))
                    }
                }
            }
        }
        None => {
            None
        }
    }
}

pub struct CommonLexer;

impl Lexer for CommonLexer {
    fn word_matcher<'a>(&self, text: &'a str) -> Option<(&'a str, &'a str)> {
        word_matcher_with_string(text)
    }

    fn ignorer<'a>(&self, text: &'a str) -> &'a str {
        ignore_space_and_line_comment(text)
    }
}
