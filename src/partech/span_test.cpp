#include "lib.hpp"

int
main() {
  auto x = span_t {
    .lo = 2,
    .hi = 10,
  };
  auto y = span_t {
    .lo = 1,
    .hi = 10,
  };
  auto z = span_t {
    .lo = 1,
    .hi = 10,
  };

  assert(!span_eq(x, y));
  assert(span_eq(y, z));
}
