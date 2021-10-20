---
title: 8. Pick a Number, Any Number
date: 2021-05-24
---

# Sameness is judgment that can be expressed by a type constructor

Sameness is indeed a judgment. But, Another sandwich?
with a new type constructor, types can
express a new idea called equality.

We can express two functions always find the same result.

This is a new perspective on types.

Types can be read as statements (propositions).

Xie: Recall that,
judgment is attitude person take towards expression,
judgment is attitude person take when thinking about expression,
maybe all form of judgment can be expressed by types (types are again expression),
but we should not mix the two terms "judgment" and "type",
because in some moment, maybe we do not know
how to express a form of judgment as type.

Judgments correspond to the concepts we used in our implementation of a language,
in a implementation these concepts will be implemented as functions like:
- `check`
- `check_type`
- `check_same`

But "forall" and "exists" are special, they do not correspond to functions in implementation.

Creating expressions that capture the ideas behind a form of judgment
is sometimes called internalizing the form of judgment.

# judging a statement to be true

If a type can be read as a statement,
then judging the statement to be true means that
there is an expression with that type.

Thus in this view,
truth means that we have evidenced,
and this evidence is called a proof.

# Definition of Neutral again

Expressions that are not values
and cannot yet be evaluated due to a variable
are called neutral.

A more precise way to define neutral
expressions is to start with the simplest
neutral expressions and build from there.

Variables are neutral, unless they refer to definitions,
because a defined name is the same as its definition.

Also, if the target of an eliminator expression is neutral,
then the entire expression is neutral.

# Type theory encode patterns of reasoning

Judgments often can be mechanically checked using relatively simple rules.
This is why judgments are a suitable basis for knowledge.

Expressions, however, can encode interesting patterns of reasoning,
such as using induction to try each possibility
for the variable in a neutral expression.

# Total function

Why it is important that all functions should be total?
Because only total functions can be viewed as proof.
