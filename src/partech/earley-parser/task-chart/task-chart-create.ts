import * as TaskChart from "../task-chart"
import * as Token from "../../token"

export function create(tokens: Array<Token.Token>): TaskChart.TaskChart {
  const length = tokens.length + 1

  const task_maps = new Array()
  for (let i = 0; i < length; i++) {
    task_maps.push(new Map())
  }

  return {
    task_maps,
  }
}
