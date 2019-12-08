#[derive(Clone)]
#[derive(Debug)]
#[derive(PartialEq, Eq)]
pub struct Span {
    pub lo: usize,
    pub hi: usize,
}
