use crate::span::Span;

#[derive(Clone)]
#[derive(Debug)]
#[derive(PartialEq, Eq)]
pub struct ErrorDuringParsing {
    pub msg: String,
    pub span: Span,
}
