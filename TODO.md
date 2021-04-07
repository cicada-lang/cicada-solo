- [pre-fillable] `Telescope` -- api re-design

- [pre-fillable] `ClsValue.readback`
- [pre-fillable] `ClsValue.eta_expand`
- [pre-fillable] `ClsValue.dot`
- [pre-fillable] `ClsValue.apply`

- [pre-fillable] `Obj.check`

- `Ext.evaluate`
- `Ext.infer`
- `Ext.repr`
- `Ext.alpha_repr`
- `Ext` -- syntax -- matcher
- `ExtValue`
  - `Ext` can not evaluate to `ClsValue`,
    because we need to handle lexical scope
  - we need to use `ExtValue` to chaine `ClsValue`
- `ExtValue` should be readback to `Cls`

- [class] -- handle `this`
  - since we do not have recursion, `this` will be `so far`

- [pie] `List` -- `List` `li()` `nil`
- [pie] `Vector` --  `Vector` `vli()` `vnil`

- [optimization] use native `number` as `Nat`

- [pattern matching] algebric datatype -- `@datatype`
  - generate `ind`

- [tlt]
  - 5. Lists, Lists, and More Lists
  - 6. Precisely How Many?
  - 7. It All Depends On the Motive
  - Recess: One Piece at a Time
  - 8. Pick a Number, Any Number
  - 9. Double Your Money, Get Twice as Much
  - 10. It Also Depends On the List
  - 11. All Lists Are Created Equal
  - 12. Even Numbers Can Be Odd
  - 13. Even Haf a Baker's Dozen
  - 14. There's Safety in Numbers
  - 15. Imagine That ...
  - 16. If It's All the Same to You
  - A. The Way Forward
  - B. Rules Are Made to Be Spoken
