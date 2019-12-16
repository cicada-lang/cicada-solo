#pragma once

#include "lib.hpp"

struct token_t {
  string str;
  span_t span;
};

void
token_hi();
