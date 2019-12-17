#pragma once

#include "lib.hpp"

struct token_t {
  std::string str;
  span_t span;
};

bool
token_eq(const token_t &x, const token_t &y);

