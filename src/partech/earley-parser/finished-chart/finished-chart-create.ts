import * as FinishedChart from "../finished-chart"
import * as Token from "../../token"

export function create(
  tokens: Array<Token.Token>
): FinishedChart.FinishedChart {
  const length = tokens.length + 1

  const finished_chart = new Array()
  for (let i = 0; i < length; i++) {
    finished_chart.push(new Map())
  }

  return finished_chart
}
