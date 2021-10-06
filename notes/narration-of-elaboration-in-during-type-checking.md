---
title: Narration of elaboration during type checking
---

# Understanding elaboration

To help understanding elaboration during type checking,
we can inject a `Narrator` into `check` and `infer`,
and mark an expression by `@elaborate`,
for narration of elaboration during type checking.

# Interaction by editing code

Interaction should be achieved by editing code.

The program simply watch for file changes
and print different messages as feedback.

In the feedback message, the program can suggests
different choices of next editing action.
(Imagine a type system based logic adventure role play game.)

We consistently prefix a syntactic keyword by `@`
to denote "interaction".

Since, the `watch` mode will be used as the main interface
to provide feedback for interaction with our system.
We need to improve its design constantly.

# User defined Interaction

User must be able to authoring interactions
-- defining new `@` keywords.

The key of interaction is choices,
a user defined interaction can take argument,
and suggests different choices by matching on the argument.
(Or apply any other computation on the argument.)

# References

This note is inspired by
the appendix "Rules are made to be spoken"
of the book "The Litter Typer".
