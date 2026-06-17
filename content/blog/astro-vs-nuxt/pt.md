---
title: "Astro vs. Nuxt: Qual você deveria usar para o seu blog?"
description: Se você está querendo iniciar um blog, provavelmente vai se deparar com essas duas opções tão populares. Neste post, vou dissertar sobre os pontos positivos e negativos de cada um.
date: 2026-06-17
updated:
---
Olá! Nesses últimos dias, eu dei uma olhada no [Astro](https://astro.build/), uma framework para websites que tem como seu foco principal o conteúdo; ou seja, ela foi feita pensando diretamente em artigos, documentações e blogs.

O maior benefício dela é dado pelo Javascript *mínimo*. Isso me chamou muita atenção. Eu comentei [no meu primeiro post](https://blog.marciosobel.dev/pt/my-first-blog-post/) que havia pensado bastante entre usar o Astro ou [Hugo](https://gohugo.io/) para o meu blog, mas acabei escolhendo o [Nuxt](https://nuxt.com/) por ser uma framework feta para construir websites do zero, o que me daria mais flexibilidade para moldar o site para ficar no meu estilo.

Entretanto, decidi testar o Astro, e ver o que seria dele para mim. Quem sabe eu não o uso no lugar do `Nuxt` nesse blog?
## Por que Astro?
Logo de cara, o que mais me chamou atenção no Astro foi seu foco em conteúdo estático. Isso significa que ele não foi feito para ter muita interatividade: botões, requisições, formulários... Ele foi feito para coisas que mudam *muito pouco*, como documentação, artigos, *landing pages* e blogs.

Ele possui suporte *first-level* para Markdown, linguagem que uso para escrever os meus posts. Também, ele evita ao máximo enviar código Javascript para o usuário; isso significa que os sites sempre são super leves.

Bom, eu decidi testar o Astro pois eu fiquei com uma pulga atrás da orelha em relação ao `Nuxt`: ele leva consigo o runtime de Javascript do `Vue` junto. Apesar de ser pouca coisa, eu queria que o meu blog fosse o mais simples e leve possível. E assim começou minha jornada!
## Recriando o meu blog com Astro
Vamos lá, primeiro vamos ver o que eu quero conseguir aqui.
- Escrever meus posts em Markdown e não me preocupar com como eles vão parar no site; quero apenas escrever, subir na nuvem e o build do Astro deve atualizar a listagem e gerar os links de acordo;
- Ter o site em dois ou mais idiomas.

É, o blog é bem simples; mas, acredito que, com essas exigências, vai dar para sujar bem as mãos na framework.
### Dando início ao projeto
Essa é a parte mais fácil e a mais direta de toda essa jornada. Só precisei rodar:
```
pnpm create astro@latest
```
E seguir o passo a passo do robôzinho cuti cuti.

A arquitetura é bem simples, rotas baseadas por arquivos... Tudo super intuitivo. Eu não usei nenhum template, então para mim só tinha um `index.astro`, com a tela toda em branco, apenas com um `h1` escrito "Astro".

Bom, vamos começar a riscar alguns itens da lista.
### Listando todos os posts
Comecei criando uma pasta `posts/`, e coloquei os posts do blog nela. Como o Astro já foi feito pensado em lidar com posts, então foi bem fácil. Basta criar um arquivo `content.config.ts` com o seguinte código:
```typescript
const blog = defineCollection({
  loader: glob({ base: "posts", pattern: "**/*.{md,mdx}" }),
});

export const collections = { blog };
```
Isso foi bem fácil. Eu usei o `zod` para criar um schema para os *frontmatters*, os metadados, dos posts.

Então, no arquivo `index.astro`, o *entrypoint* do website, eu coloquei o seguinte:
```astro
---
import { getCollection } from "astro:content";
const posts = await getCollection("blog");
if (!posts) return Astro.redirect("/404");
---

<h1>Blog</h1>
<ul>
  {posts.map((post) => (
    <li>
      <a href={post.id}>{post.data.title}</a>
    </li>
  ))}
</ul>
```
Eeeee isso funcionou? Foi muito fácil!

No Astro, qualquer código executado entre as "fences" (`---`) é executado apenas em *build time*. Isso significa que nossa aplicação até o momento está com um total de zero  Javascript!
### Gerando páginas dinamicamente
Após a criação da página de listagem de posts, eu queria criar uma página para cada post. Para isso, eu precisava de uma *rota dinâmica*, ou seja, precisaria que o Astro gerasse as páginas para mim.

Gostaria de aproveitar este momento e dizer que a documentação do Astro é muito boa! Definitivamente seria muito mais trabalhoso fazer isso sem ela.

Enfim, eu criei um arquivo `[slug].astro`. Este arquivo aceita qualquer valor como entrada, e eu posso usar esse valor via código.
```astro
---
const { slug } = Astro.params;
---
<p>Slug: {slug}</p>
```
Então usei isso para pegar o ID de um post. Felizmente, o Astro já possui uma função específica para pegar um item de uma coleção: `getEntry`. Ela recebe a coleção e o ID para buscar. Após isso, precisava saber como mostrar o conteúdo `markdown` em `HTML`. Então me deparo com a função `render`, que útil!
```
---
import { getEntry, render } from "astro:content";
const { slug } = Astro.params;
const post = await getEntry("blog", slug);
if (!post) return Astro.redirect("/404");
const { Content } = await render(post);
---
<Content />
```
E em teoria era para funcionar super bem... Mas o Astro não consegue saber todas as rotas possíveis para o `[slug].astro`, o que o impedia de deixar o site limpo de javascript. Para contornar isso, temos que dizer ao Astro **todas as rotas possíveis**. Fazemos isso exportando uma função `getStaticPaths`, que *felizmente* pode ser `async`, onde retornamos uma lista com todas as variáveis completadas. Também podemos passar props para cada página, o que significa que podemos passar todos os posts diretamente!
```astro
---
import { getCollection, render } from "astro:content"; // agora, pegamos a coleção inteira!

export async function getStaticPaths() {
  const posts = await getCollection("blog");
  return posts.map((post) => ({
    params: { slug: post.id },
    props: { post }, // podemos passar o post diretamente para a página!
  }));
}

const { post } = Astro.props; // E o post é garantido que existe!
const { Content } = await render(post);
---
<Content />
```
Okay! Isso foi bem fácil.

Testando os diferentes posts, vi que um deles estava renderizando os acentos errado. Por exemplo, ao invés de da palavra `água`, o HTML renderizado retornava `Ã¡gua`. Fiquei confuso do motivo, e aparentemente o Astro não define mais o charset do documento como UTF-8 por padrão. Fiquei bem confuso pois [só vi isso sendo citado em um lugar das docs](https://docs.astro.build/en/guides/markdown-content/#frontmatter-layout-property)? Mas tudo bem, perdi um tempinho nessa parte.
### Lidando com diferentes idiomas
Caso você nunca tenha notado, este blog está disponível tanto em Português do Brasil, quanto em Inglês. Até o momento em que escrevo este post, todos os posts estão disponíveis nos dois idiomas. Não sei se em algum momento eles vão divergir e ter conteúdos diferentes.

Enfim, ter múltiplos idiomas é algo necessário. Como o bom programador que sou™, quis deixar dinâmico o suficiente para ter a menor dor de cabeça possível caso eu queira escrever em algum outro idioma. Primeiro, alterei o arquivo `content.config.ts` para ter os posts separados:
```typescript
function createCollection(suffix: string) {
  return defineCollection({
    loader: glob({ base: `posts/${suffix}`, pattern: "**/*.{md,mdx}" });
  });
}

export const collections = {
  "blog-en": createCollection("en"),
  "blog-pt": createCollection("pt"),
};
```
E então criei um arquivo `i18n.ts` com o seguinte código:
```typescript
const entries = {
  en: {
    "all-posts": "All posts",
  },
  pt: {
    "all-posts": "Todos os posts",
  },
};

export type Locales = keyof typeof entries;
export const locales = Object.keys(entries) as Locale[];
export const defaultLocale: Locale = "en" as const;

import { getCollection as getContentCollection } from "astro:content";

export function getCollection(locale: Locale = defaultLocale) {
	return getContentCollection(`blog-${locale}`);
}
```
A arquitetura das páginas ficou assim:
```
src/
├──  content.config.ts
├──  i18n.ts
├── pages/
│   ├── [lang]/
│   │   ├── [slug].astro
│   │   └── index.astro
│   ├── [slug].astro
└── └── index.astro
```
E todo lugar que eu precisasse do idioma selecionado, foi só colocar `const { lang = defaultLocale } = Astro.params`.

Daí em diante, tudo funcionou perfeitamente bem. Eu criei um componente que coloca o sufixo do idioma no URL, e assim eu podia trocar de idiomas. Tudo funcionou perfeitamente e, até o momento, *zero* Javascript!
### Onde as coisas começaram a desandar...
No Astro, o markdown é renderizado para um HTML. A renderização é bem básica: links viram `<a>`, headings viram `<h1>`, `<h2>`... Tudo normal. Acontece que eu queria uma pequena customização: se você quiser testar neste post, todo título é clicável. Eu deixei assim pois, caso alguém queira compartilhar apenas um tópico específico do post, é possível. Para isso, eu criei um componente de `Prose` no Nuxt, que me permite dar um *override* nas tags geradas com o markdown.

No Astro, entretanto, isso não é possível. Não de uma maneira simples. Eu tinha duas escolhas:
1. Usar `MDX` para escrever os posts no lugar do markdown e chamar os componentes conforme necessários, ou;
2. Usar um plugin do rehype para alterar as tags no momento de renderização.

Como não gosto de `mdx`, eu fui com a segunda opção. Acontece que isso gerou um código muito feio, pouco funcional (bugava muito) e que eu não ia entender poucos dias depois. Mas, tudo bem, eu o fiz ainda assim.

E pronto, após adicionar o  css, eu tinha uma réplica exata do meu blog, 100% funcional.
## Veredito e comparação
Bom, o blog inteiro não ficou imune de Javascript. É possível pesquisar por posts e tem como alternar entre tema claro e escuro. Eu buildei o site e quis ver o quão pesado ele estava.

> As métricas estão na medida `<tamanho_comprimido>/<tamanho_real>`. O site sempre será baixado comprimido e é descomprimido localmente. Você pode acessar o post de referência [aqui](https://blog.marciosobel.dev/switching-to-nixos/).  Todos os caches foram desabilitados nas medidas.

Meu blog, com `Nuxt`, a listagem de todos os posts utiliza **228 kB / 569 kB**. Acessar um post utiliza **351 kB / 657 kB**.

A réplica, com `Astro`, na tela de listagem, utiliza **164 kB / 166 kB**. Acessar um post utiliza **257 kB / 260 kB**

É possível notar que o Astro usa 28% menos rede que o Nuxt na listagem, e 27% menos ao visualizar um post, sendo a sua maior diferença nos dados descomprimidos, possuindo uma diferença de 71% na listagem e 60% ao visualizar um post!
## Conclusão: com qual framework vou ficar?
A diferença no bundle final é certamente notável. O Astro entrega um site muito mais leve, apenas com o conteúdo que você escolhe entregar. Mas, apesar disso, eu decidi me manter com o Nuxt. Eis o motivo: eu gosto de mexer nas coisas de lá pra cá. Achei o Astro para este meu caso de uso pouco maleável, especialmente na parte de modificar o output do markdown. E, apesar dele ser bem mais leve, é apenas no conteúdo não comprimido; na parte de rede, a diferença não é tão gritante assim,. Os celulares e computadores hoje nem se esforçam direito para compensar essa diferença. Então aceito fazer esse sacrifício em troca de uma DX melhor.

Todavia, o Astro com certeza me conquistou com seu charme e simplicidade. Com certeza vou utilizá-lo para gerar documentação de possíveis libs minhas no futuro. Eu não cheguei a explorar todo o potencial dele e, se eu estivesse começando do zero, eu provavelmente pegaria um template e construiria a partir dele.

E esta foi minha review do Astro, espero que tenham tido uma boa leitura. Até a próxima!