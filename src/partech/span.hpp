#pragma once

#include "lib.hpp"

struct span_t {
  size_t lo;
  size_t hi;
};

bool
span_eq(const span_t &x, const span_t &y);
