#pragma once

#include "../common.hpp"

struct span_t {
  size_t lo;
  size_t hi;
};

struct token_t {
  string str;
  span_t span;
};

void
token_hi();
