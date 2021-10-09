# 蝉语 / Cicada Language

Welcome **\*^-^\*/**

Cicada language is a dependently typed programming language and interactive theorem prover.

The aim of cicada project is to help people understand that
developing software and developing mathematics
are increasingly the same kind of activity,
and people who practices these developments,
can learn from each other, and help each other in very good ways.

## Install

```
npm i -g @cicada-lang/cicada
```

## Usage

### Command Line Interface

After installed the `@cicada-lang/cicada` package, <br>
you can run `cic help`, and you will see the following help messages:

```
Usage:
  command [arguments] [options]

Default command:
  [paper]  Open REPL or run a paper

Commands:
  repl [dir]        Open an interactive REPL
  run [paper]       Run a paper or a page of book
  snapshot [paper]  Take a snapshot of a paper
  check [book]      Check the typing of a book
  help [name]       Display help for a command

Help:
  The help command displays help for a given command.

    cic help help
```

## Development

```
npm install    // Install dependences
npm run build  // Compile `src/` to `lib/`
npm run watch  // Watch the compilation
npm run test   // Run test
```

## Books

- [The Little Typer](books/the-little-typer)
- [Category Theory](books/category)
- [Group Theory](books/group)
- [Order Theory](books/order)

## Community

- GitHub Organization: [github.com/cicada-lang](https://github.com/cicada-lang)
- IRC channel: `#cicada-lang` at [libera.chat](https://libera.chat)
- Telegram group: [CicadaLanguage](https://t.me/CicadaLanguage)

## Contributions

> Be polite, do not bring negative emotion to others.

- [TODO.md](TODO.md)
- [STYLE-GUIDE.md](STYLE-GUIDE.md)
- [CODE-OF-CONDUCT.md](CODE-OF-CONDUCT.md)
- When contributing, add yourself to [AUTHORS](AUTHORS)

## License

- [GPLv3](LICENSE)
