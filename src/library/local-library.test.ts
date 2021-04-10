import { LocalLibrary } from "../library"
import Path from "path"

async function test(): Promise<void> {
  const file = "../../libraries/algebra/library.json"
  const lib = await LocalLibrary.fromConfigFile(Path.resolve(__dirname, file))
  console.log(lib)
}

test().catch((error) => {
  console.error(error)
  process.exit(1)
})
