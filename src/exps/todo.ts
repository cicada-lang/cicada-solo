import {Exp} from "../exp";
import {Ctx} from "../ctx";
import {Value} from "../value";
import {Core} from "../core";
import {TodoCore} from "./todo-core";
import {QuoteCore} from "./str/quote-core";
import * as Exps from "./var";

export class Todo extends Exp {
    message: string

    constructor(message: string) {
        super()
        this.message = message
    }

    free_names(bound_names: Set<string>): Set<string> {
        return new Set()
    }

    subst(name: string, exp: Exp): Exp {
        return this
    }

    repr(): string {
        return `TODO(${(new QuoteCore(this.message)).repr()})`
    }

    check(ctx: Ctx, t: Value): Core {
        return new TodoCore(this.message, t)
    }
}
