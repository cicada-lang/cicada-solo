---
title: Style Guide
---

**In general, observe the style of existing code and respect it.**

# About `framework/`

Modules in `framework/` directory are independent helper modules
that might be extracted to their own packages.

# Hierarchy of resources

Think of the system as a hierarchy of resources:

```
Library -> Mod -> Stmt -> Exp
```

Top-level syntax of module is statement oriented -- `Stmt`.

# Semantics architecture

Use first-order syntax to implement `Exp`.

When necessary, use `Exp.subst` to do substitution.
