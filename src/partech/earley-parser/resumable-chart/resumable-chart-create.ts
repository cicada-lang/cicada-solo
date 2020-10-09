import * as ResumableChart from "../resumable-chart"
import * as Token from "../../token"

export function create(
  tokens: Array<Token.Token>
): ResumableChart.ResumableChart {
  const length = tokens.length + 1

  const resumable_chart = new Array()
  for (let i = 0; i < length; i++) {
    resumable_chart.push(new Map())
  }

  return resumable_chart
}
