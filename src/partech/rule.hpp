#pragma once

#include "lib.hpp"

struct symbol_t;

struct rule_t {
  std::string name;
  std::map<std::string, std::vector<symbol_t>> choices;
};

enum symbol_kind_t {
  is_symbol_str,
  is_symbol_rule,
};

struct symbol_t {
  symbol_kind_t kind;
  virtual ~symbol_t();
};

struct symbol_str_t: symbol_t {
  symbol_kind_t kind = is_symbol_str;
  std::string str;
  symbol_str_t(std::string str);
};

struct symbol_rule_t: symbol_t {
  symbol_kind_t kind = is_symbol_rule;
  rule_t rule;
  symbol_rule_t(rule_t rule);
};

bool
symbol_eq(const symbol_t &x, const symbol_t &y);
