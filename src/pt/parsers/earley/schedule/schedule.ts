import * as Task from "../task"
import * as Value from "../../../value"
import * as Token from "../../../token"
import * as ut from "../../../../ut"

export class Schedule {
  constructor(
    public queue: Array<Task.Task>,
    public chart: Array<Map<string, Task.Task>>
  ) {}
}
