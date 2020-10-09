import * as TaskChart from "../task-chart"
import * as Token from "../../token"

export function create(tokens: Array<Token.Token>): TaskChart.TaskChart {
  const length = tokens.length + 1

  const chart = new Array()
  for (let i = 0; i < length; i++) {
    chart.push(new Map())
  }

  return chart
}
