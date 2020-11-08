module.exports = [
  ["identifier", "^\\s*([_\\p{Letter}][_\\p{Letter}0-9]*)\\s*", "u"],
  ["string", '^\\s*("(\\\\.|[^"])*")\\s*'],
  ["number", "^\\s*(\\d+|\\d+\\.\\d+|-\\d+|-\\d+\\.\\d+)\\s*"],
  ["symbol", "^\\s*([^_\\p{Letter}0-9\\s]+)\\s*", "u"],
]
