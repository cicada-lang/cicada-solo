class Category {
  Object : Type
  Morphism : { dom, cod : Object -> Type }
  id : { a : Object -> Morphism(a, a) }
  compose : {
    suppose a, b, c : Object
    f : Morphism(a, b)
    g : Morphism(b, c)
    -> Morphism(a, c)
  }
  id_left : {
    suppose a, b : Object
    f : Morphism(a, b)
    -> Equation(compose(id(a), f), f)
  }
  id_right : {
    suppose a, b : Object
    f : Morphism(a, b)
    -> Equation(compose(f, id(b)), f)
  }
  compose_associative : {
    suppose a, b, c, d : Object
    f : Morphism(a, b)
    g : Morphism(b, c)
    h : Morphism(c, d)
    -> Equation(compose(f, compose(g, h)), compose(compose(f, g), h))
  }
}

// mono(cat).morphism()
// mono(cat).cancel_right(f, g, equation)

Mono(cat : Category) = record {
  morphism : {
    suppose a, b : cat.Object
    -> cat.Morphism(a, b)
  }
  cancel_right : {
    suppose c : cat.Object
    f : cat.Morphism(c, a)
    g : cat.Morphism(c, a)
    Equation(cat.compose(f, morphism), cat.compose(g, morphism))
    -> Equation(f, g)
  }
}

Mono = {
  cat : Category
  ------
  morphism : {
    suppose a, b : cat.Object
    -> cat.Morphism(a, b)
  }
  cancel_right : {
    suppose c : cat.Object
    f : cat.Morphism(c, a)
    g : cat.Morphism(c, a)
    Equation(cat.compose(f, morphism), cat.compose(g, morphism))
    -> Equation(f, g)
  }
}

Mono = {
  cat : Category
  ------
  record {
    morphism : {
      suppose a, b : cat.Object
      -> cat.Morphism(a, b)
    }
    cancel_right : {
      suppose c : cat.Object
      f : cat.Morphism(c, a)
      g : cat.Morphism(c, a)
      Equation(cat.compose(f, morphism), cat.compose(g, morphism))
      -> Equation(f, g)
    }
  }
}

develop Category {
  class Mono {
    morphism : {
      suppose a, b : Object
      -> Morphism(a, b)
    }
    cancel_right : {
      suppose c : Object
      f : Morphism(c, a)
      g : Morphism(c, a)
      Equation(compose(f, morphism), compose(g, morphism))
      -> Equation(f, g)
    }
  }

  class Epi {
    morphism : {
      suppose a, b : Object
      -> Morphism(a, b)
    }
    cancel_left : {
      suppose c : Object
      f : Morphism(b, c)
      g : Morphism(b, c)
      Equation(compose(morphism, f), compose(morphism, g))
      -> Equation(f, g)
    }
  }

  class Iso {
    morphism : {
      suppose a, b : Object
      -> Morphism(a, b)
    }
    inverse : {
      suppose a, b : Object
      -> Morphism(b, a)
    }
    inverse_left : Equation(compose(morphism, inverse), id(a))
    inverse_right : Equation(compose(inverse, morphism), id(b))
  }
}
