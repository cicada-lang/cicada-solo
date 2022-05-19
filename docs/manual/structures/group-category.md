---
title: Group Category
---

Example of a big category.

# GroupHom

TODO

```
class GroupHom {
  dom: Group
  cod: Group
  hom(dom.Elem): cod.Elem

  hom_respect_mul(x: dom.Elem, y: dom.Elem): TheEqual(
    cod.Elem,
    hom(dom.mul(x, y)),
    cod.mul(hom(x), hom(y)))
}
```

# group_category

TODO

```
let group_category: Category(Group, GroupHom) = new Category {
  id(dom: Group): GroupHom(dom, dom) =
    new GroupHom {
      hom(x: dom.Elem): dom.Elem = x
      hom_respect_mul(x: dom.Elem, y: dom.Elem) = Same(dom.mul(x, y))
    }

  // given G: Group, H: Group, K: Group
  compose(f: GroupHom(G, H), g: GroupHom(H, K)) =
    new GroupHom {
      dom = G
      cod = K
      hom(x: G.Elem) = g.hom(f.hom(x))
      hom_respect_mul(x: G.Elem, y: G.Elem) = Same(g.hom(H.mul(f.hom(x), f.hom(y))))
    }

  // given G: Group, H: Group
  id_left(f: GroupHom(G, H)) = Same(f)

  // given G: Group, H: Group
  id_right(f: GroupHom(G, H)) = Same(f)

  // given G: Group, H: Group, K: Group, L: Group
  compose_associative(f: GroupHom(G, H), g: GroupHom(H, K), h: GroupHom(K, L)) = Refl
}
```
