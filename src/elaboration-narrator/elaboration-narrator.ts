export class ElaborationNarrator {
  narrate(lines: Array<string>): void {
    const story = lines.join("\n")
    console.log(story)
  }
}
