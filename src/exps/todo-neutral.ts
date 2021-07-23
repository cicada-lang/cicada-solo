import {Neutral} from "../neutral";
import {Ctx} from "../ctx";
import {Core} from "../core";
import {TodoCore} from "./todo-core";

export class TodoNeutral extends Neutral {
    message: string

    constructor(message: string) {
        super()
        this.message = message
    }

    readback_neutral(ctx: Ctx): Core {
        return new TodoCore(this.message)
    }
}
