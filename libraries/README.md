## Note about `git subtree`

We use `git subtree` to manage libraries in this directory.

You can run `sh add-remotes.sh` to add the following remotes:

```
[remote "libraries/the-little-typer"]
        url = git@github.com:xieyuheng/the-little-typer
        fetch = +refs/heads/*:refs/remotes/xieyuheng/the-little-typer/*

[remote "libraries/cicada-stdlib"]
        url = git@github.com:cicada-lang/cicada-stdlib
        fetch = +refs/heads/*:refs/remotes/cicada-lang/cicada-stdlib/*
```
