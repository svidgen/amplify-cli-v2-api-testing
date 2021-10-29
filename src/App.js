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

  const batches = 20;
  for (var i = 0; i < batches; i++) {
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
    console.log(`batch ${i} of ${batches} created`);
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

const doSearch = async () => {
  console.log(
    "search for beer",
    (
      await API.graphql({
        query: searchTodos,
        variables: {
          filter: {
            name: {
              match: "beer",
            },
          },
        },
      })
    ).data.searchTodos.items
  );
};

const getAggregates = async () => {
  const result = (
    await API.graphql({
      query: searchTodos,
      variables: {
        sort: [{ field: "name", direction: "desc" }],
        limit: 20,
        aggregates: [
          { type: "max", field: "points", name: "max" },
          { type: "min", field: "points", name: "min" },
          { type: "avg", field: "points", name: "avg" },
          { type: "sum", field: "points", name: "sum" },
          { type: "terms", field: "name", name: "terms" },
        ],
      },
    })
  ).data.searchTodos;

  result.aggregateItems.forEach((item) => {
    console.log(item.name, item.result.value || item.result.buckets);
  });

  console.log(
    "item names",
    result.items.map((item) => item.name)
  );
  console.log("total", result.total);
};

(async () => {
  console.clear();
  await clearTestData();
  await createTestData();

  console.log('letting data "settle", then searching and aggregating');
  setTimeout(async () => {
    await doSearch();
    await getAggregates();
  }, 5000);
})();

function App() {
  return <div className="App">See the console.</div>;
}

export default App;
