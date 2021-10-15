/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const searchTodos = /* GraphQL */ `
  query SearchTodos(
    $filter: SearchableTodoFilterInput
    $sort: [SearchableTodoSortInput]
    $limit: Int
    $nextToken: String
    $from: Int
    $aggregates: [SearchableTodoAggregationInput]
  ) {
    searchTodos(
      filter: $filter
      sort: $sort
      limit: $limit
      nextToken: $nextToken
      from: $from
      aggregates: $aggregates
    ) {
      items {
        id
        name
        description
        points
        createdAt
        updatedAt
      }
      nextToken
      total
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
    }
  }
`;
export const getTodo = /* GraphQL */ `
  query GetTodo($id: ID!) {
    getTodo(id: $id) {
      id
      name
      description
      points
      createdAt
      updatedAt
    }
  }
`;
export const listTodos = /* GraphQL */ `
  query ListTodos(
    $filter: ModelTodoFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listTodos(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        name
        description
        points
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
