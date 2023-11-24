# Criar enquete

> ## Caso de sucesso:

- [x] Recebe uma requisição do tipo **POST** na rota **/api/sorveys**
- [x] Valida se a requisição foi feita por um admin
- [x] Valida dados obrigatórios **question** e **answers**
- [x] Valida se o campo Answers tem pelo menos 2 respostas
- [x] Cria uma enquete com os dados fornecidos
- [x] Retorna 204

> ## Exceções:
- [x] Retorna erro 404 se a API não existir
- [x] Retorna erro 403 se o usuário não for admin
- [x] Retorna erro 400 se question ou answer não forem fornecidos pelo client
- [x] Retorna erro 500 se der erro ao tetar a enquete
