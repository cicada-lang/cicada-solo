#[test]
fn test_char_len_utf8_for_safe_split_at() {
    let s = "中文测试";
    if let Some(c) = s.chars().next() {
        let (head, rest) = s.split_at(c.len_utf8());
        assert_eq!(head, "中");
        assert_eq!(rest, "文测试");
    }
}
