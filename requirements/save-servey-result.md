# Responser enquete

> ## Caso de sucesso

- [ ] Recebe uma requisição do tipo **PUT** na rota **/api/surveys/{survey_id}/results**
- [ ] Valida se a requisição foi feita por um **usuário**
- [x] Valida o parâmetro **survey_id**
- [ ] Valida se o campo **answer** é uma resposta válida
- [ ] **Cria** um resultado de enquete com os dados fornecidos caso não tenha um registro
- [ ] **Atualiza** um resultado de enquete com os dados fornecidos caso já exista um registro
- [ ] Retorna 200 com os dados do resultado da enquete

## Excessões

- [ ] Retorna erro 404 se a API não existir
- [ ] Retorna erro 403 se não for um usuário
- [x] Retorna erro 403 se o survey_id passado na URL for inválido
- [ ] Retorna erro 403 se a resposta enviada pelo client for uma resposta inválida
- [ ] Retorna erro 500 se der erro ao tentar criar o resultado da enquete
- [ ] Retorna erro 500 se der erro ao tentar atualizar o resultado da enquete
- [ ] Retorna erro 500 se der erro ao tentar carregar a enquete
