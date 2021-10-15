import logo from "./logo.svg";
import "./App.css";
import Amplify, { API } from "aws-amplify";
import amplifyconfig from "./aws-exports";
import { getTodo, listTodos, searchTodos } from "./graphql/queries";
import { createTodo, deleteTodo } from "./graphql/mutations";
import { useEffect } from "react";

Amplify.configure(amplifyconfig);

const createTestData = async () => {
  const tasks = [
    ["make todo list", 10],
    ["add items to the list", 20],
    ["do the things on the list", 30],
    ["relax with beer", 5],
    ["relax with beer", 11],
  ];

  const responses = [];

  for (const [name, points] of tasks) {
    responses.push(
      await API.graphql({
        query: createTodo,
        variables: {
          input: {
            name,
            description: `${name} description`,
            points,
          },
        },
      })
    );
  }

  console.log("create responses", responses);
};

const clearTestData = async () => {
  const todos = (
    await API.graphql({
      query: listTodos,
    })
  ).data.listTodos;
  console.log("todos to remove", todos);

  for (const todo of todos.items) {
    console.log(
      "deleting todo",
      await API.graphql({
        query: deleteTodo,
        variables: {
          input: { id: todo.id },
        },
      })
    );
  }
};

// const aggregates = ['sum'];
// for (const agg of aggregates) {
//   console.log(`aggs ${agg}`,
//     await API.graphql.searchTodos({

//     })
//   );
// }

/*
queries.js needs `aggregateItems` modfied to be this:

aggregateItems {
  name
  result {
    ... on SearchableAggregateScalarResult {
      __typename
      value
    }
    ... on SearchableAggregateBucketResult {
      __typename
      buckets {
        doc_count
        key
      }
    }
  }
}

*/

const getAggregates = async () => {
  (
    await API.graphql({
      query: searchTodos,
      variables: {
        aggregates: [
          { type: "max", field: "points", name: "max" },
          { type: "min", field: "points", name: "min" },
          { type: "avg", field: "points", name: "avg" },
          { type: "sum", field: "points", name: "sum" },
          { type: "terms", field: "name", name: "terms" },
        ],
      },
    })
  ).data.searchTodos.aggregateItems.forEach((item) => {
    console.log(item.name, item.result.value || item.result.buckets);
  });
};

(async () => {
  console.clear();
  await clearTestData();
  await createTestData();

  console.log('letting data "settle", then getting aggs');
  setTimeout(() => getAggregates(), 5000);
})();

function App() {
  return <div className="App">See the console.</div>;
}

export default App;
