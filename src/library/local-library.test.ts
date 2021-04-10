import { LocalLibrary } from "../library"
import Path from "path"
import * as ut from "../ut"

async function test_create(): Promise<void> {
  const file = "../../libraries/algebra/library.json"
  const lib = await LocalLibrary.from_config_file(Path.resolve(__dirname, file))

  const base_dir = "../../libraries/algebra"
  ut.assert_equal(lib.base_dir, Path.resolve(__dirname, base_dir))
  ut.assert_equal(lib.config.name, "algebra")
}

test_create().catch((error) => {
  console.error(error)
  process.exit(1)
})

async function test_load(): Promise<void> {
  const file = "../../libraries/algebra/library.json"
  const lib = await LocalLibrary.from_config_file(Path.resolve(__dirname, file))
  const mod = await lib.load("category.cic")
  const cached = await lib.load("category.cic")
  ut.assert_equal(mod === cached, true)
}

test_load().catch((error) => {
  console.error(error)
  process.exit(1)
})

async function test_import(): Promise<void> {
  const file = "../../libraries/algebra/library.json"
  const lib = await LocalLibrary.from_config_file(Path.resolve(__dirname, file))
  const mod = await lib.load("functor.cic")
  const cached = await lib.load("functor.cic")
  ut.assert_equal(mod === cached, true)
}

test_import().catch((error) => {
  console.error(error)
  process.exit(1)
})
