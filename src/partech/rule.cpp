#include "lib.hpp"

symbol_t::~symbol_t() {}

bool
symbol_eq(const symbol_t &x, const symbol_t &y) {
  // TODO
  return true;
}

symbol_str_t::symbol_str_t(std::string str) {
  this->str = str;
}

symbol_rule_t::symbol_rule_t(rule_t rule) {
  this->rule = rule;
}
