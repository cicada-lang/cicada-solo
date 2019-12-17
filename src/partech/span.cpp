#include "lib.hpp"

bool
span_eq(span_t &x, span_t &y) {
  return
    (x.lo == y.lo) &&
    (x.hi == y.hi);
}
