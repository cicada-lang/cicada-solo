import {Core, AlphaCtx} from "../core"
import {Env} from "../env"
import {Value} from "../value"
import * as Exps from "../exps"
import {QuoteCore} from "../exps";

export class TodoCore extends Core {
    message: string

    constructor(message: string) {
        super()
        this.message = message
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
