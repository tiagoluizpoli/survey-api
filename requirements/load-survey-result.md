# Responser enquete

> ## Caso de sucesso

- [x] Recebe uma requisição do tipo **GET** na rota **/api/surveys/{survey_id}/results**
- [x] Valida se a requisição foi feita por um **usuário**
- [ ] Retorna **200** com os dados do resultado de enquete
## Excessões

- [x] Retorna erro **404** se a API não existir
- [x] Retorna erro **403** se não for um usuário
- [x] Retorna erro **500** se der erro ao tentar listar o resultado da enquete
- [x] Retorna erro **500** se der erro ao tentar carregar a enquete
