## Para publicar:

1) git status | git add . | git commit -m 'DIZ SOBRE O QUE FEZ'
2) vtex release patch stable (ELE VAI PERGUNTAR ALGUMAS VEZES SE VC QUER AUMENTAR A VERSÃO, VOCE VAI CONFIRMANDO ATÉ O FINAL)
3) vtex deploy --force (SE NAO USAR O --force VOCE TEM QUE ESPERAR 7MINUTOS PRA DAR O DEPLOY. COM O --force, VOCE IGNORA ISSO. DAI É SÓ DAR YES NAS DUAS PERGUNTAS DELE)
4) vtex use master (VOLTA PRA MASTER)
5) vtex update (QUANDO USAR ELE, VAI APARECER QUE TEM UM TEMPLATE PRA ATUALIZAR, NO CASO, O TEMA QUE VOCE ACABOU DE DAR DEPLOY, DAI É SÓ CONFIRMAR)

Comandos 1, 2 e 3. São no ambiente de homologação.
Comandos 4 e 5 são na master.

--

git status | git add . | git commit -m 'DIZ SOBRE O QUE FEZ'
vtex release patch stable
vtex deploy --force
vtex use master
vtex update

--
