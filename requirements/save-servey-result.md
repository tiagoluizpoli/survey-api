# Responser enquete

> ## Caso de sucesso

- [x] Recebe uma requisição do tipo **PUT** na rota **/api/surveys/{survey_id}/results**
- [x] Valida se a requisição foi feita por um **usuário**
- [x] Valida o parâmetro **survey_id**
- [x] Valida se o campo **answer** é uma resposta válida
- [x] **Cria** um resultado de enquete com os dados fornecidos caso não tenha um registro
- [x] **Atualiza** um resultado de enquete com os dados fornecidos caso já exista um registro
- [x] Retorna 200 com os dados do resultado da enquete

## Excessões

- [x] Retorna erro 404 se a API não existir
- [x] Retorna erro 403 se não for um usuário
- [x] Retorna erro 403 se o survey_id passado na URL for inválido
- [x] Retorna erro 403 se a resposta enviada pelo client for uma resposta inválida
- [x] Retorna erro 500 se der erro ao tentar criar o resultado da enquete
- [x] Retorna erro 500 se der erro ao tentar atualizar o resultado da enquete
- [x] Retorna erro 500 se der erro ao tentar carregar a enquete
