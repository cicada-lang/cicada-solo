import {Core, AlphaCtx} from "../core"
import {Env} from "../env"
import {Value} from "../value"
import * as Exps from "../exps"
import {QuoteCore} from "../exps";

export class TodoCore extends Core {
    message: string
    type: Core

    constructor(message: string, type: Core) {
        super()
        this.message = message
        this.type = type
    }

    evaluate(env: Env): Value {
        return new Exps.TypeValue()
    }

    repr(): string {
        return `TODO(${(new QuoteCore(this.message)).repr()})`
    }

    alpha_repr(ctx: AlphaCtx): string {
        return this.repr()
    }
}
