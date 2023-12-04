# Responser enquete

> ## Caso de sucesso

- [ ] Recebe uma requisição do tipo **GET** na rota **/api/surveys/{survey_id}/results**
- [ ] Valida se a requisição foi feita por um **usuário**
- [ ] Retorna **204** se não houver nenhum, resultado de enquete
- [ ] Retorna **200** com os dados do resultado de enquete
## Excessões

- [ ] Retorna erro **404** se a API não existir
- [ ] Retorna erro **403** se não for um usuário
- [ ] Retorna erro **500** se der erro ao tentar listar o resultado da enquete
- [ ] Retorna erro **500** se der erro ao tentar carregar a enquete
