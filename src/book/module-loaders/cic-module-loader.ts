import { ModuleLoader } from "../module-loader"
import { Book } from "../../book"
import { Module } from "../../module"
import { Parser } from "../../parser"
import { Stmt } from "../../stmt"

export class CicModuleLoader extends ModuleLoader {
  parse(text: string): Array<Stmt> {
    const parser = new Parser()
    const stmts = parser.parse_stmts(text)
    return stmts
  }
}
