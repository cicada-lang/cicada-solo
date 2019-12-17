#pragma once

#include "lib.hpp"

struct span_t {
  size_t lo;
  size_t hi;
};

bool
span_eq(span_t &x, span_t &y);
