#include "lib.hpp"

bool
token_eq(const token_t &x, const token_t &y) {
  return
    span_eq(x.span, y.span) &&
    x.str == x.str;
}
