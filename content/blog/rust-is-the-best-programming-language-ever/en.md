---
title: Rust is the BEST programming language
description: And I can prove it.
date: 2026-01-19
updated: 2026-01-29
---
You’re probably already tired of hearing that “Rust is safe”, “Rust is the most loved programming language in the world,” “Rust is the future.”

Even though these claims are based on solid foundations, very little is said about the _real_ positive aspects of Rust. I’m going to list a few positive factors beyond the language’s safety, robustness, and speed.
## Clear Domain Modeling
Rust allows you to model a domain in a clear and concise way. Enums with superpowers make it possible to define rules that, in other languages, would require much more boilerplate.

Let me give you an example:
```rust
enum DownloadStatus {
    Inactive,
    Processing { progress: u32 },
    Error(String)
    Done,
}
```
Here we have an enum that can give us metadata about a download. In other languages, you’d probably need to create a class with all the necessary metadata (which could be `null`), and then implement several _workarounds_ to validate things correctly. With Rust, not only is it impossible for metadata to be `null`, but it’s also very easy to access it, with the guarantee that it’s always valid.
## Extremely Powerful Switch Statements
In the programming universe, `switch` is used to check for equal values. In modern programming, the use of `match` has become more and more common: a new kind of `switch` that allows you to use patterns for validation.

Here’s an example of a `match` in Rust:
```rust
let value = 5;
match value {
    0..=10 => println!("Number is between 0 and 10!"),
    11 | 13 | 17 | 19 => println!("Prime number!"),
    n if n % 2 == 0 => println!("Even number!"),
    n => println!("I don't know what to do with {n}"),
}
```
It’s also possible to do _pattern matching_ in an `if`. Using the previous `DownloadStatus` example:
```rust
let status = DownloadStatus::Error("Failed to download".into());
if let DownloadStatus::Error(error) = status {
    eprintln!("Erro no download: {}", error);
}
```
It may look like just more _boilerplate_, but `enum`s combined with this kind of _pattern matching_ make the code much more robust and safe as the codebase grows!
## Explicit Mutability
Another very positive aspect of Rust is its explicit mutability. Everything is immutable by default:
```rust
let x = 10;
x = x * 2; // Code fails here
```
The code fails because `x` is immutable. To make it mutable, we need to add the `mut` keyword:
```rust
let mut x = 10;
x = x * 2;
```
In this example, it doesn’t look like a big deal. But this becomes extremely useful when we’re talking about function arguments:
```rust
let mut myText = String::from("Hello, world");
printText(&myText);
changeText(&mut myText);
```
It’s immediately clear whether a function is going to mutate a variable or not. In C or Go, passing the address of a variable leaves its mutability up to the function’s implementation, forcing the developer to read the documentation or inspect the code.
## Macros!
It’s possible to do _metaprogramming_ in Rust — that is, code that writes Rust code. Macros in Rust are practically a whole new language, but the crates [`syn`](https://crates.io/crates/syn) and [`quote`](https://crates.io/crates/quote) make the process much more intuitive and fluid. I highly recommend watching [this video](https://youtu.be/SMCRQj9Hbx8) to understand it better. I won’t go too deep into macros here, I could write an entire post just about them (maybe someday).
## Configuration in TOML
I’ll admit it: I _love_ `TOML`. More than `YAML`, and infinitely more than `JSON`. It’s a clear, minimal language, and you can read the entire [spec](https://toml.io/en/v1.1.0) in about 15 minutes. Rust uses TOML to define versions, dependencies, features, formatter configuration... It’s great!
## Not everything is sunshine and rainbows
Of course, Rust isn’t perfect. Especially at the beginning, when you have to fight against your own habits to program in Rust. It has several DX issues, like verbosity, long compile times (even in debug), and don’t even get me started on lifetimes. I won't be covering the bads here, only the pros. Perhaps I could make a evil version of this post only talking about the bad side of Rust.
## Conclusion
Rust has great fundamentals, a wonderful macro system, and `cargo` rocks. It’s definitely a modern, robust, fast, and safe language. Winning the title of the most loved programming language in the world for several consecutive years is no surprise. I hope I managed to clearly cover some of the aspects of the language that I like the most, beyond the obvious points from many other posts on the internet (safety, _blazingly fast_, etc.).

If you’re starting to use Rust in a project, remember to make it very clear that you use it — just like an Arch user (btw). The cult must grow. 🦀
