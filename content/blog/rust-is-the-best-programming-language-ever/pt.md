---
title: Rust é a MELHOR linguagem de programação
description: E eu posso provar.
date: 2026-01-19
updated:
---
Você já deve estar farto de ouvir que "Rust é seguro", "Rust é a linguagem de programação mais amada do mundo", "Rust é o futuro".

Apesar dessas afirmações possuirem bases concretas, pouco se fala sobre os *reais* pontos positivos do Rust. Vou citar alguns fatores positivos além da segurança, robustez e velocidade da linguagem.
## Modelo de Domínio claro
Rust permite fazer a modelagem de um domínio de uma maneira clara e concisa. Os enums com superpoderes permitem definir regras que outras linguagens precisam de um boilerplate maior.

Vou dar um exemplo:
```rust
enum DownloadStatus {
    Inactive,
    Processing { progress: u32 },
    Error(String)
    Done,
}
```
Temos aqui um enum que nos dá informações sobre um download. Em outras linguagens, provavelmente seria necessário criar uma classe, com todos os metadados necessários (que podem ser `null`), e teria que fazer vários *workarounds* para fazer a checagem correta. Com o Rust, não só não tem como um metadado ser `null`, como também é muito fácil acessá-los, com a segurança de que estão sempre válidos.
## Switch statements poderosíssimos
No universo da programação, o `switch` é usado para checar valores iguais. Na programação moderna, está se tornando cada vez mais abundante o uso de `match`: um novo `switch` que permite utilizar patterns para validações.

Aqui vai um exemplo de um `match` no Rust:
```rust
let value = 5;
match value {
    0..=10 => println!("Número entre 0 e 10!"),
    11 | 13 | 17 | 19 => println!("Número primo!");
    n if n % 2 == 0 => println!("Número par!");
    n => println!("Não sei o que fazer com o número {n}");
}
```
Também é possível fazer *pattern matching* em um `if`. Utilizando o exemplo anterior de `DownloadStatus`:
```rust
let status = DownloadStatus::Error("Falha ao baixar".into());
if let DownloadStatus::Error(error) = status {
    eprintln!("Erro no download: {}", error);
}
```
Pode parecer apenas um *boilerplate* mas os `enum`s com esses `pattern matching`s tornam o código mais robusto e seguro!
## Mutabilidade explícita
Outro ponto muito positivo do Rust é a sua mutabilidade explícita. Tudo é imutável por padrão:
```rust
let x = 10;
x = x * 2; // O código falha aqui!
```
O código falha pois `x` é imutável. Para deixá-la mutável, temos que adicionar a keyword `mut`:
```rust
let mut x = 10;
x = x * 2;
```
Neste exemplo, não parece grande coisa. Mas é uma informação muito útil quando estamos falando de argumentos de funções:
```rust
let mut meuTexto = String::from("Olá, mundo");
printText(&meuTexto);
changeText(&mut meuTexto);
```
Fica claro se uma função vai alterar uma variável ou não. Em C ou Go, passar o endereço de uma variável deixa sua mutabilidade para a implementação da função, forçando o desenvolvedor a ler a documentação ou ver seu código.
## Macros!
É possível fazer *metaprogramming* no Rust — ou seja, um código que escreve código Rust. Macros em Rust são praticamente uma linguagem nova, mas as crates [`syn`](https://crates.io/crates/syn) e [`quote`](https://crates.io/crates/quote) deixam o processo mais intuitivo e fluido, recomendo muito ver [esse vídeo](https://youtu.be/SMCRQj9Hbx8) para entender melhor. Não vou me aprofundar muito em macros aqui, daria pra fazer um post inteiro só sobre eles (quem sabe um dia).
## Configuração em TOML
Admito, eu *amo* `TOML`. Infinitamente mais do que `YAML`, e com certeza mais que `JSON`. É uma linguagem clara, mínima e você consegue ler toda a [spec](https://toml.io/en/v1.1.0) em uns 15 minutos. Rust usa TOML para definir versão, dependências, features, configuração do formatter, é ótimo!
## Nem tudo são flores
Claro, Rust não é perfeito. Principalmente no início, onde você tem que lutar contra seus fundamentos para programar em Rust. Ele possui vários problemas na DX, como verbosidade, compile-time longo (mesmo em debug), e nem me deixe encostar em lifetimes.
## Conclusão
O Rust possui ótimos fundamentos, um sistema de macro maravilhoso e o `cargo` é sensacional. Com certeza é uma linguagem moderna, robusta, rápida e segura. Ganhar por vários anos consecutivos o título da linguagem mais amada do mundo não é surpresa. Espero que eu tenha conseguido cobrir alguns dos pontos da linguagem que mais gosto com clareza, além dos pontos óbvios de muitos outros posts da internet (a segurança, ser *blazingly fast*, etc.)

Caso esteja começando a usar Rust em algum projeto, lembre-se de deixar bem claro que o usa, como se fosse um usuário de Arch (btw). O culto deve se proliferar. 🦀