import { Module } from "../module"

export abstract class ModuleLoader {
  abstract load(path: string, text: string): Promise<Module>
}
