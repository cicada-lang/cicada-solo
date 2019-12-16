#include "lib.hpp"

int
main() {
  auto span = span_t {
    .hi = 10,
    .lo = 2,
  };
  cout << span.hi;
}
