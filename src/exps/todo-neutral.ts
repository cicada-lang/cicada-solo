import {Neutral} from "../neutral";
import {Ctx} from "../ctx";
import {Core} from "../core";
import {TodoCore} from "./todo-core";
import {Value} from "../value";

export class TodoNeutral extends Neutral {
    message: string
    type: Value

    constructor(message: string, type: Value) {
        super()
        this.message = message
        this.type = type
    }

    readback_neutral(ctx: Ctx): Core {
        return new TodoCore(this.message, this.type)
    }
}
