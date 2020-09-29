import * as TaskChart from "../task-chart"
import * as Token from "../../token"

// NOTE `tokens.length + 1 === chart.length`

export function create(tokens: Array<Token.Token>): TaskChart.TaskChart {
  const chart = new Array()
  for (let i = 0; i < tokens.length + 1; i++) {
    chart.push(new Map())
  }
  return chart
}
