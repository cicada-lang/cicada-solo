import { TestCase } from "@xieyuheng/test-case"
import { Mod, ModLoader } from "../lang/mod"

export default class extends TestCase {
  assertModHasValue(mod: Mod, name: string): void {
    const value = mod.env.find_value(name)
    this.assert(value)
  }

  assertModHasNotValue(mod: Mod, name: string): void {
    const value = mod.env.find_value(name)
    this.assert(!value)
  }

  async "A ModLoader can load Mod from url."() {
    const loader = new ModLoader()
    loader.fetcher.register(
      "mock",
      (url) => "let id: (A: Type) -> (A) -> A = (A, x) => x"
    )

    const mod = await loader.loadAndExecute(new URL("mock:id.cic"))

    this.assertModHasValue(mod, "id")
  }

  async "A ModLoader can load markdown code."() {
    const loader = new ModLoader()
    loader.fetcher.register("mock", (url) =>
      [
        "```cicada",
        "let id: (A: Type) -> (A) -> A = (A, x) => x",
        "let x = { let y = sole; return y }",
        "```",
      ].join("\n")
    )

    const mod = await loader.loadAndExecute(new URL("mock:example.md"))

    this.assertModHasValue(mod, "id")
    this.assertModHasValue(mod, "x")
  }

  async "A Mod can run a given block, will undo blocks after it."() {
    const loader = new ModLoader()
    loader.fetcher.register("mock", (url) =>
      [
        "# Church Numerals",

        "```cicada",
        'let a = "a"',
        "```",

        "```cicada",
        'let b = "b"',
        "```",

        "```cicada",
        'let c = "c"',
        "```",
      ].join("\n")
    )

    const mod = await loader.loadAndExecute(new URL("mock:example.md"))

    this.assertModHasValue(mod, "a")
    this.assertModHasValue(mod, "b")
    this.assertModHasValue(mod, "c")

    const block = mod.blocks.getOrFail(1)
    // await block.run(mod, 'let d = "d"')

    // this.assertModHasValue(mod, "a")
    // this.assertModHasValue(mod, "d")
    // this.assertModHasNotValue(mod, "b")
    // this.assertModHasNotValue(mod, "c")
  }
}
