# Chathula-Sampath

## Simple Bank

### NOTE: Use Node 16 LTS

## Usage - Run whole project at once

```
docker-compose up --build
```

- run below graphql mutation to create accounts
```gql
mutation createAccount {
  createAccount(accountInput: { balance: 2000 }) {
    account_id
    balance
    created_at
    updated_at
  }
}
```

- run below graphql query to get all accounts to identify the uuid of accounts
```gql
query getAllAccounts {
  getAllAccounts {
    account_id
    balance
    created_at
    updated_at
  }
}
```

- run below graphql mutation to make a transaction and update values
```gql
mutation makeTransaction {
  makeTransaction(createTransactionInput: {
    amount: 10,
    to: "to-uuid",
    from: "from-uuid"
  }) {
    transaction_id
    amount
    from
    to
    created_at
    updated_at
  }
}
```

## Notes

- We can add database transactions with rollbacks for transactions
- We can write more unit tests and e2e tests more with higher code coverage to improve the codebase quality
- We can add multiple environment files to build on different environments
- We can add migrations instead of `synchronize: true` as it is more secure for production
- we can disable graphql debug and playground on production
