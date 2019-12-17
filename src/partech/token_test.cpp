#include "lib.hpp"

int
main() {
  auto x = token_t {
    .str = "123",
    .span = {
      .lo = 0,
      .hi = 3,
    }
  };

  auto y = token_t {
    .str = "1234",
    .span = {
      .lo = 0,
      .hi = 4,
    }
  };

  auto z = token_t {
    .str = "1234",
    .span = {
      .lo = 0,
      .hi = 4,
    }
  };

  assert(!token_eq(x, y));
  assert(token_eq(y, z));
}
