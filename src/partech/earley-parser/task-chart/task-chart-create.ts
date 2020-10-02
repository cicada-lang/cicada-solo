import * as TaskChart from "../task-chart"
import * as Token from "../../token"

// NOTE The length of chart is one greater then the length of tokens.

export function create(tokens: Array<Token.Token>): TaskChart.TaskChart {
  const tasksets = new Array()
  for (let i = 0; i < tokens.length + 1; i++) {
    tasksets.push(new Map())
  }
  return { tasksets }
}
