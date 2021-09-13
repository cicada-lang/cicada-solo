import { Module } from "../../module"

export interface ModuleViewer {
  view(mod: Module): string
}
