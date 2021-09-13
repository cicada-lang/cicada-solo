import { ModuleViewer } from "../library"
import { Module } from "../module"

export const module_viewer: ModuleViewer = {
  view(mod: Module): string {
    return mod.output
  },
}
