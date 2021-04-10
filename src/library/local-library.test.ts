import { LocalLibrary } from "../library"
import Path from "path"
import * as ut from "../ut"

async function test(): Promise<void> {
  const file = "../../libraries/algebra/library.json"
  const lib = await LocalLibrary.fromConfigFile(Path.resolve(__dirname, file))

  const base_dir = "../../libraries/algebra"
  ut.assert_equal(lib.base_dir, Path.resolve(__dirname, base_dir))
}

test().catch((error) => {
  console.error(error)
  process.exit(1)
})
