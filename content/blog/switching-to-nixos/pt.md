---
title: Porque eu troquei para o NixOS (E porque você também deveria)
description: Recentemente, eu troquei para o NixOS, deixando todo o meu sistema declarativo. Nesse post, eu vou explicar os prós, os contras, e se migrar pode ser uma boa opção para você.
date: 2026-03-28
---
Oi! Recentemente, mudei para o [NixOS](https://nixos.org) e foi uma das melhores coisas que já fiz. Meu sistema nunca esteve tão estável e, ao mesmo tempo, tão permissivo. Também sinto que tenho muito mais controle: o que está instalado, onde cada config fica, serviços ativos, daemons e por aí vai. O repositório `nixpkgs` é ***gigante***. Sério: [ele é maior que o AUR](https://repology.org/repositories/graphs)!

Vou explicar o porquê de ele ser tão bom, os pontos negativos e se você deve ou não usá-lo. Mas primeiro, vamos falar sobre o que sequer *é* o NixOS e como ele se destaca de outras distros Linux.
# O que é o Nix?
Antes de falar do NixOS, deixe-me apresentar o `nix`. O `nix` é um *gerenciador de pacotes funcional*. Isso significa que ele trata pacotes como valores em uma linguagem de programação puramente funcional (como Haskell). Os pacotes não são instalados onde você esperaria (como em `/usr/bin`); em vez disso, eles vão para o `/nix/store`. E cada pacote tem seu próprio subdiretório exclusivo. Veja o Firefox, por exemplo:

```
/nix/store/b6gvzjyb2pg0kjfwrjmg1vfhh54ad73z-firefox-33.1/
```

Esse hash (`b6gvzjyb...`) é o identificador único que captura todas as dependências desse pacote. Graças a esse sistema de hashing, você pode ter várias versões do mesmo pacote *ao mesmo tempo*, sem ter que lidar com conflitos de dependência ou quebras no sistema.

Além disso, devido ao identificador único, o `nix` consegue remover pacotes não utilizados usando um *garbage collector*. Isso significa que seu sistema sempre tem apenas o que você realmente quer!
# O que é o NixOS?
O NixOS leva o gerenciador de pacotes `nix` ao limite, aplicando sua filosofia a um sistema operacional inteiro. Isso significa que seu kernel, drivers, resolução de monitor, aplicativos e configurações são todos descritos de maneira funcional e declarativa.

O sistema não segue os [padrões FHS](https://refspecs.linuxfoundation.org/FHS_3.0/fhs/index.html), o que significa que não existe `/bin`, `/lib` ou `/usr`. Tudo o que ele contém está na *nix store*.

A configuração do sistema pode ser encontrada em `/etc/nixos/`, onde você verá dois arquivos:

- `hardware-configuration.nix`: Gerado automaticamente pelo sistema. Você provavelmente nunca precisará mexer aqui (pelo menos assim espero!).
- `configuration.nix`: Onde a configuração do seu sistema realmente mora. É aqui que você diz ao Nix quais pacotes devem estar instalados, quais serviços ou daemons devem rodar, qual interface de desktop usar, etc.

Aqui está um exemplo de como instalar o `git`:
```nix
# configuration.nix
{
	# ...
	environment.systemPackages = [pkgs.git];
}
```
...E é isso. Se você quiser desinstalar, basta remover o `pkgs.git` da lista. Simples assim!

Contudo, salvar o arquivo não instalará o `git` sozinho. Isso seria um pesadelo. Você precisa *rebuildar* seu sistema. E digo isso literalmente. Rodar `nixos-rebuild` vai reconstruir todo o seu sistema do zero, instalando ou desinstalando qualquer pacote que você adicionou ou removeu, parando ou iniciando serviços, e assim por diante.

Isso pode parecer um pouco preocupante, mas não se preocupe! Graças à *nix store*, seu sistema faz um backup completo antes de cada rebuild. Então, se você por acaso deletar seu driver de vídeo sem querer, pode simplesmente selecionar a build anterior no gerenciador de boot. Para reconstruir seu sistema, é só rodar:
```
nixos-rebuild switch
```
Isso vai reconstruir seu sistema e mudar para ele imediatamente (sem precisar reiniciar o computador). Você também pode voltar facilmente para a configuração anterior usando o argumento `--rollback`.

Se você quiser apenas ver como as mudanças afetam seu sistema sem criar um backup (como um rebuild "descartável"), pode simplesmente rodar:
```
nixos-rebuild test
```
Existem muitas outras formas de reconstruir seu sistema, até mesmo como criar uma VM, mas não vou falar sobre isso aqui. Além do mais, esses dois são provavelmente os comandos que você mais usará de qualquer maneira.

Bem, essa é uma explicação simples de como o `nix` e o NixOS funcionam. Você provavelmente vai querer se aprofundar, e para isso não posso recomendar outro canal mais do que o [Vimjoyer](https://www.youtube.com/@vimjoyer). Lá, você encontrará mais sobre a linguagem `nix`, como criar módulos, como organizá-los e tudo mais.
# Você deveria migrar para o NixOS?
## Prós
Primeiro, vou falar para quem eu acho que o NixOS vale a pena:
### Desenvolvedores
O NixOS oferece uma DX incrível. Ele suporta ambientes de desenvolvimento isolados e reproduzíveis, o que significa que o argumento "funciona no meu PC" agora realmente significa que funciona. Você pode pensar nisso como containers Docker, só que melhor! Além disso, você pode usar o NixOS para declarar a estrutura de um servidor, ou seja, se você mudar de arquitetura (trocando de host, por exemplo), pode ter todas as suas configurações e serviços ativos em segundos apenas copiando o arquivo `configuration.nix` da máquina antiga!
### Entusiastas
Se você gosta de explorar tecnologia, fazer *ricing*, criar suas próprias configs ou apenas fuçar em geral, o NixOS é um prato cheio! Ele é familiar o suficiente para você se sentir confortável, mas diferente o suficiente para manter as coisas interessantes e divertidas de mexer.
## Contras
Agora, eu acho que o NixOS **não** é uma boa opção para você se:
### Você quer apenas que as coisas funcionem rápido
Se você só quer baixar o VSCode e quer que ele funcione na hora, ou se você só usa o navegador, ou até se acha que configurar o Neovim sozinho dá "trabalho demais", então acho que o NixOS não é para você. Configurar o NixOS é tedioso e demora. Mesmo que você possa copiar o arquivo de outra pessoa para ter um ponto de partida sólido, acredito que não adaptar o sistema às suas próprias necessidades é um desperdício do potencial do OS e resultará apenas em uma experiência frustrante se você precisar mudar algo depois.
### Você é novo no Linux
Se você é novo no mundo Linux, acho que o NixOS é demais para você. Vá explorar o Ubuntu, Mint ou até o Fedora. Depois, você pode mergulhar no Arch, Void ou NixOS. Entenda como o Linux funciona e como ele é construído para, então, ser capaz de ver como sistemas de baixo nível o moldam para extrair o máximo dele.
# Conclusão
É isso! Talvez eu faça mais posts compartilhando as coisas que descubro no sistema. Enquanto isso, você pode encontrar meus *dotfiles* atuais [aqui](https://github.com/marciosobel/dotfiles). Até a próxima!