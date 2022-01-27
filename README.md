## Configurações Iniciais

1) vtex install vtex.store@2.x --force
2) vtex install vtex.admin@3.x
3) vtex install vtex.admin-pages@4.x
4) vtex install vtex.admin-apps@3.x
5) vtex install vtex.rewriter@1.x --force
6) vtex install vtex.admin-search vtex.search-resolver@1.x
7) vtex install vtex.reviews-and-ratings@2.x

Instalar Wishlist, seguir documentação:
https://vtex.io/docs/components/all/vtex.wish-list@1.2.0/

Depois de instalar todos, vá ao Admin da Loja, procure no menu lateral por 'Busca > Configuração de integração' e clique em 'Iniciar Integração'.

Baixar tema que irá utilizar e modificar os arquivos com base na nova loja, alterando o 'vendor', para mais dúvidas, seguir os passos:
https://developers.vtex.com/vtex-developer-docs/docs/vtex-io-documentation-1-basicsetup

## Comandos mais utilizados

yarn global add vtex
vtex login *loja*
vtex whoami
vtex ls
vtex update
vtex deploy
vtex install 'vendor'@'version'

## Comandos de Desenvolvimento:
1) vtex use bnv - Para acessar o ambiente de homologação
2) vtex link - Para poder modificar o código e ele replicar as alterações
3) Para colocar em produção as alterações feitas:
	(Em ambiente de homologação)
	-> git status | git add . | git commit -m 'O que foi feito'
	-> vtex release patch stable
	-> vtex deploy --force

Feito isso, vá para a master usando o comando:
-> vtex use master

E então atualize o template
-> vtex update

## Apps

* Para criar novos apps precisa autorizacao da vtex via chamado:
-> Abrir chamado vtex para mudar de 'Business Edition' para 'Store Edition' (vtex.edition-store@x.x)
