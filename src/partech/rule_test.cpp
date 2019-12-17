#include "lib.hpp"

int
main() {
  auto rule = rule_t {
    .name = "exp",
    .choices = std::map<std::string, std::vector<symbol_t>>(),
  };

  auto x = symbol_str_t("123");

  auto y = symbol_rule_t(rule);

  assert(x.kind == is_symbol_str);
  assert(y.kind == is_symbol_rule);
}
