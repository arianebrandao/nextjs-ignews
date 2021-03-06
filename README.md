<p align="center">
  <img alt="ignews app" src=".github/app.png" width="100%">
</p>

## ignews
Um blog com assinatura mensal para acessar suas publicações na íntegra. É mais um projeto desenvolvido durante minha jornada no [Ignite](https://www.rocketseat.com.br/ignite), da Rocketseat.

## Tecnologias

Esse projeto foi desenvolvido com as seguintes tecnologias:

- [NextJS](https://nextjs.org)
- [TypeScript](https://www.typescriptlang.org/)
- [Fauna](https://fauna.com)
- [Prismic](https://prismic.io)
- [Stripe](https://www.stripe.com)

Esse é um sistema completo, que utiliza login social da conta Github, armazena os dados da conta no banco de dados do Fauna, processa pagamento recorrente pelo Stripe e utiliza o headless CMS Prismic para os posts do blog.

## Layout

Você pode visualizar o layout do projeto através [desse link](https://www.figma.com/file/gl0fHkQgvaUfXNjuwGtDDs/ig.news/duplicate). É necessário ter conta no [Figma](http://figma.com/) para acessá-lo.

## Testes unitários

Essa aplicação possui testes unitários, desenvolvidos durante a aula de Testes Unitários do Ignite.

Rode os testes com `yarn test`.

## Como executar

- Clone o repositório
- Instale as dependências com `yarn`
- Inicie o servidor com `yarn dev`

Agora você pode acessar [`localhost:3000`](http://localhost:3000) do seu navegador.

## Licença

Esse projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE.md) para mais detalhes.
