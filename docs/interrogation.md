> interrogation

- `Exp` is complicated, is it an union of many things?

  Yes. `Exp` will be partition into
  `Value` and `Neutral` after evaluation.

- Why `Neutral` is part of `Exp`?
  it seems evaluation of Exp will only produce `Value`.

  Because `Neutral` will be produced during `typed_readback`,
  and `typed_readback` is half of partition evaluation,
  and partition evaluation is a special kind of evaluation.

- Why `typed_readback` is half of partition evaluation?

  Because normalization is "partition evaluation to the end",
  and normalization is composed of evaluation and `typed_readback`.

- What is the distinct behavior of `Neutral`?

  `Neutral` will be produced during `typed_readback`,
  because the base of `Neutral` -- `NotYetValue`,
  will only be produced during `typed_readback`.

- `Exp` is actually partition into
  - `Intro`
  - `Elim`
  - `Ty`
  - `Typecons`
  - `Datacons`

  They are partition of `Exp`,
  thus they should not be independent from `Exp`.

- What is the distinct behavior of `Intro`?

  - Evaluation of `Intro` is simply recursion over its structure.
  - `Intro` is not `Ty`.
  - `Intro` is `typed_readback` -able.
    - Readback is complicated for `Intro`,
      we need to handle eta expansion.

- What is the distinct behavior of `Elim`?

  - Evaluation of `Elim` might progress the computation.
  - Readback of `Elim` is simply recursion over its structure.

- What is the distinct behavior of `Ty`?

  - `Ty` is `typed_readback` -er.
  - `Ty` can be `readback_as_type`.

- What is the distinct behavior of `Typecons`?

  - `Typecons` is in `Mod`.

- What is the distinct behavior of `Datacons`?

  - `Datacons` is in `Mod`, under `Typecons`
