#include "lib.hpp"

bool
span_eq(const span_t &x, const span_t &y) {
  return
    (x.lo == y.lo) &&
    (x.hi == y.hi);
}
