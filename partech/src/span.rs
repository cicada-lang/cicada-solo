#[derive(Clone)]
#[derive(Debug)]
#[derive(PartialEq, Eq)]
pub struct Span {
    lo: usize,
    hi: usize,
}
