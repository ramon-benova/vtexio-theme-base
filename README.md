## Configurações Iniciais

Executar estes comandos na Master, da raiz do projeto:

```
vtex install vtex.store@2.x --force
vtex install vtex.admin@3.x
vtex install vtex.admin-pages@4.x
vtex install vtex.admin-apps@3.x
vtex install vtex.rewriter@1.x --force
vtex install vtex.admin-search vtex.search-resolver@1.x
vtex install vtex.reviews-and-ratings@2.x
```

Instalar Wishlist, seguir documentação:
https://vtex.io/docs/components/all/vtex.wish-list@1.2.0/

Depois de instalar todos, vá ao Admin da Loja, procure no menu lateral por 'Busca > Configuração de integração' e clique em 'Iniciar Integração'.

Baixar tema que irá utilizar e modificar os arquivos com base na nova loja, alterando o 'vendor', para mais dúvidas, seguir os passos:
https://developers.vtex.com/vtex-developer-docs/docs/vtex-io-documentation-1-basicsetup


Caso baixe o template Base da Benova, seguir os seguintes passos:
1) Alterar o vendor e name dentro de 'manifest.json', e resetar o 'version' para '0.0.0':
```
Ex:
"vendor": "alphaquimica",
"name": "bnv-theme-alphaquimica",
"version": "0.0.0",
```

2) Alterar o 'vendor' do arquivo 'package.json':
```
Ex:
"name": "bnv-theme-alphaquimica",
```

3) Na pasta do tema e executar:
```
yarn add react-apollo
yarn
```

4) Na pasta '/react' dentro do tema, executar:
```
yarn add react-apollo
yarn
vtex setup
vtex setup --typings
```

## Comandos mais utilizados

```
yarn global add vtex
yarn add react-apollo
vtex login *loja*
vtex whoami
vtex ls
vtex use bnv
vtex update
vtex deploy
vtex install 'vendor'@'version'
```

## Comandos de Desenvolvimento:
1) **vtex use bnv** - Para acessar o ambiente de homologação
2) **vtex link** - Para poder modificar o código e ele replicar as alterações
3) Para colocar em produção as alterações feitas (Em ambiente de homologação):
```
git status | git add . | git commit -m 'O que foi feito'
vtex release patch stable
vtex deploy --force
```

Feito isso, vá para a master usando o comando:
```
vtex use master
```

E então atualize o template
```
vtex update
```

## Apps

Para criar novos apps precisa autorizacao da vtex via chamado:

* Abrir chamado vtex para mudar de 'Business Edition' para 'Store Edition' (vtex.edition-store@x.x)
