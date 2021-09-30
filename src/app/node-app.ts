import { App } from "../app"
import { AppFileStore } from "../app-file-store"

export class NodeApp extends App {
  files: AppFileStore = new AppFileStore()
}

export const app = new NodeApp()
