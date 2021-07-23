import {Core, AlphaCtx} from "../core"
import {Env} from "../env"
import {Value} from "../value"
import * as Exps from "../exps"
import {QuoteCore, TodoNeutral} from "../exps";

export class TodoCore extends Core {
    message: string
    type: Value

    constructor(message: string, type: Value) {
        super()
        this.message = message
        this.type = type
    }

    evaluate(env: Env): Value {
        return new Exps.NotYetValue(this.type, new TodoNeutral(this.message, this.type))
    }

    repr(): string {
        return `TODO(${(new QuoteCore(this.message)).repr()})`
    }

    alpha_repr(ctx: AlphaCtx): string {
        return this.repr()
    }
}
