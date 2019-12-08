use std::collections::HashSet;

use crate::token::Token;
use crate::rule::{ Rule, Symbol };
use crate::partech::Partech;
use crate::tree::Tree;
use crate::error::ErrorDuringParsing;

#[derive(Hash)]
#[derive(Clone)]
#[derive(Debug)]
#[derive(PartialEq, Eq)]
pub struct Item <'a> {
    rule: Rule<'a>,
    choice_name: &'a str,
    symbols: Vec<Symbol<'a>>,
    dot: usize,
    origin: usize,
    cause: Option<Box<Item<'a>>>,
}

pub struct Earley;

impl Partech for Earley {
    fn parse_tokens_by_rule<'a>(
        &self, tokens: Vec<Token<'a>>, rule: &'a Rule<'a>,
    ) -> Result<Tree<'a>, ErrorDuringParsing> {
        let parsing = Parsing::new(tokens, rule);
        unimplemented!();
    }
}

#[derive(Clone)]
#[derive(Debug)]
#[derive(PartialEq, Eq)]
pub struct Parsing <'a> {
    pub tokens: Vec<Token<'a>>,
    pub rule: &'a Rule<'a>,
    chart: Vec<HashSet<Item<'a>>>,
    start: Rule<'a>,
}

impl <'a> Parsing <'a> {
    pub fn new(tokens: Vec<Token<'a>>, rule: &'a Rule<'a>) -> Parsing <'a> {
        Parsing {
            tokens, rule,
            chart: Vec::new(),
            start: Rule {
                name: "$",
                choices: vec![
                    ("$", vec![Symbol::Rule(rule)])
                ]
            }
        }
    }

    fn add_rule_to_chart(&mut self, rule: Rule<'a>, i: usize) {
        for (choice_name, symbols) in rule.choices.iter() {
            self.chart[i].insert(Item {
                rule: rule.clone(),
                choice_name,
                symbols: symbols.clone(),
                dot: 0,
                origin: i,
                cause: None,
            });
        }
    }

    fn predict(&mut self, i: usize) {
        let mut before_length: Option<usize> = Some(self.chart[i].len());
        let mut after_length: Option<usize> = None;
        while before_length != after_length {
            before_length = Some(self.chart[i].len());
            for item in self.chart[i].clone() {
                // on item
                let symbol = &item.symbols[item.dot];
                if symbol.non_terminal_p() {
                    let rule = symbol.non_terminal_to_rule();
                    self.add_rule_to_chart(rule, i);
                }
            }
            after_length = Some(self.chart[i].len());
        }
    }

    // TODO
    // Can optimize by clone as need.
    // - using: https://doc.rust-lang.org/std/primitive.slice.html#method.split_at_mut
    fn scan(&mut self, i: usize) {
        for mut item in self.chart[i].clone().into_iter() {
            let symbol = &item.symbols[item.dot];
            if symbol.terminal_p() {
                let word = self.tokens[i].word;
                if symbol.terminal_match(word) {
                    item.symbols[item.dot] = Symbol::Word(word);
                    item.dot = item.dot + 1;
                    self.chart[i+1].insert(item);
                }
            }
        }
    }

    fn complete(&mut self, i: usize) {
        let mut before_length: Option<usize> = Some(self.chart[i].len());
        let mut after_length: Option<usize> = None;
        while before_length != after_length {
            before_length = Some(self.chart[i+1].len());
            for cause_item in self.chart[i+1].clone() {
                // on cause_item
                if cause_item.dot == cause_item.symbols.len() {
                    for origin_item in self.chart[cause_item.origin].clone() {
                        let symbol = &origin_item.symbols[origin_item.dot];
                        if symbol.non_terminal_p() {
                            let rule = symbol.non_terminal_to_rule();
                            if &rule == &cause_item.rule {
                                self.chart[i+1].insert(Item {
                                    dot: origin_item.dot + 1,
                                    cause: Some(Box::new(cause_item.clone())),
                                    ..origin_item.clone()
                                });
                            }
                        }
                    }
                }
            }
            after_length = Some(self.chart[i+1].len());
        }
    }

}
