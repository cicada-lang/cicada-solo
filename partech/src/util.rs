pub fn str_index_of_char_pred<'a>(
    s: &'a str,
    char_pred: fn (char) -> bool,
) -> Option<usize> {
    for i in 0..s.len() {
        match s[i..].chars().next() {
            Some(c) => {
                if char_pred(c) {
                    return Some(i)
                }
            }
            None => {
                // non utf8 boundary.
            }
        }
    }
    None
}

#[test]
fn test_str_index_of_char_pred() {
    use std::collections::HashSet;

    fn space_char_set() -> HashSet<char> {
        vec![
            ' ', '\n', '\t'
        ].into_iter().collect()
    }

    fn char_pred(c: char) -> bool {
        space_char_set().contains(&c)
    }

    assert_eq!(Some(1), str_index_of_char_pred("a b c", char_pred));
}

pub fn str_split_by_char_pred<'a>(
    s: &'a str,
    char_pred: fn (char) -> bool,
) -> Option<(&'a str, &'a str)> {
    match str_index_of_char_pred(s, char_pred) {
        Some(i) => {
            Some(s.split_at(i))
        }
        None => {
            None
        }
    }
}
