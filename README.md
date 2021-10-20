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

### Web Services

Cicada project supports many web services.

For details, please visit: [cicada-lang.org](https://cicada-lang.org)

### Command Line Interface

After installed the `@cicada-lang/cicada` package, <br>
you can run `cic help`, and you will see the following help messages:

```
Usage:
  command [arguments] [options]

Default command:
  [article]  Open REPL or run an article

Commands:
  repl [dir]          Open an interactive REPL
  run [article]       Run through an article
  snapshot [article]  Take a snapshot of an article
  check [book]        Check the typing of a book
  help [name]         Display help for a command

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

- [The Little Typer Exercises](books/the-little-typer-exercises)
- [Mathematical Structures](books/mathematical-structures)

## Community

- GitHub: [github.com/cicada-lang](https://github.com/cicada-lang)
- Telegram: [CicadaLanguage](https://t.me/CicadaLanguage)
- IRC: `#cicada-lang` at [libera.chat](https://libera.chat)

## Contributions

> Be polite, do not bring negative emotion to others.

- [TODO.md](TODO.md)
- [STYLE-GUIDE.md](STYLE-GUIDE.md)
- [CODE-OF-CONDUCT.md](CODE-OF-CONDUCT.md)
- When contributing, add yourself to [AUTHORS](AUTHORS)

## License

- [GPLv3](LICENSE)
