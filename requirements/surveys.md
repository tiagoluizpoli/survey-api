# Listar enquetes

> ## Caso de sucesso

- [ ] Recebe uma requisição do tipo **GET** na rota **/api/survey**
- [ ] Valida se a requisição foi feita por um usuário
- [x] Retorna 200 com os dados das enquetes
- [x] Retorna 204 se não houver nenhuma enquete

## Excessões

- [ ] Retorna erro 404 se a API não existir
- [ ] Retorna erro 403 se não for um usuário
- [x] Retorna erro 500 se der erro ao tentar listar as enquetes
