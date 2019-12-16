#include "token.hpp"

int
main() {
  auto span = span_t {
    .hi = 100,
    .lo = 2,
  };

  token_hi();
  cout << span.hi;
}
