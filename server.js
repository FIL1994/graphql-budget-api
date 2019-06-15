const express = require("express");
const graphqlHTTP = require("express-graphql");
const { buildSchema } = require("graphql");

const expenses = [];
let id = 0;

const schema = buildSchema(`
    type Expense {
        id: ID!
        description: String!
        amount: Float!
    }

    input ExpenseInput {
        description: String!
        amount: Float!
    }

    type Query {
        expenses: [Expense]
        getExpense(id: ID!): Expense
    }

    type Mutation {
        createExpense(expense: ExpenseInput): Expense
    }
`);

const root = {
  expenses() {
    return expenses;
  },
  createExpense({ expense }) {
    expense.id = ++id;
    expenses.push(expense);
    return expense;
  },
  getExpense({ id }) {
    return expenses.find(expense => expense.id === id);
  }
};

const app = express();
app.use(
  "/graphql",
  graphqlHTTP({
    schema,
    rootValue: root,
    graphiql: true
  })
);
app.listen(4000);

console.log("Running a GraphQL API server at localhost:4000/graphql");
