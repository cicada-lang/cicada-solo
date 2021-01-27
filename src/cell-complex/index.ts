type Complex = Array<Array<Cell>>

type SphericalComplex = Complex & { spherical_evidence: "TODO" }

type Cell = {
  dom: SphericalComplex
  cod: Complex
  fig: Figure
}

type Figure = {
  src: Cell
  tar: Cell
  cfg: Cell
}

type Morphism = {
  dom: Complex
  cod: Complex
  fig: Figure
}
