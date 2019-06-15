const express = require("express");
const graphqlHTTP = require("express-graphql");
const { buildSchema } = require("graphql");

const expenses = [];
const incomes = [];
let expenseID = 0;
let incomeID = 0;

const schema = buildSchema(`
    type Query {
        expenses: [Expense]
        getExpense(id: ID!): Expense
        incomes: [Income]
        getIncome(id: ID!): Income
    }

    type Mutation {
        createExpense(expense: ExpenseInput): Expense
        createIncome(income: IncomeInput): Income
    }

    interface Transaction {
        description: String!
        amount: Float!
    }

    type Expense implements Transaction {
        id: ID!
        description: String!
        amount: Float!
    }

    input ExpenseInput {
        description: String!
        amount: Float!
    }

    type Income implements Transaction {
        id: ID!
        description: String!
        amount: Float!
    }

    input IncomeInput {
        description: String!
        amount: Float!
    }
`);

const root = {
  expenses() {
    return expenses;
  },
  createExpense({ expense }) {
    expense.id = ++expenseID;
    expenses.push(expense);
    return expense;
  },
  getExpense({ id }) {
    return expenses.find(expense => expense.id === id);
  },
  incomes() {
    return incomes;
  },
  createIncome({ income }) {
    income.id = ++incomeID;
    incomes.push(income);
    return income;
  },
  getIncome({ id }) {
    return incomes.find(income => income.id === id);
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
