import {
  ApolloClient,
  InMemoryCache,
  ApolloClientOptions,
  NormalizedCacheObject,
  HttpLink,
} from '@apollo/client/core'
import _ from 'lodash'
import { OperationDefinitionNode } from 'graphql'
import { median } from '../../utils/math'
import { testCases } from './testCases'
import chalk from 'chalk'
import { has, isObject } from '../../utils/misc'

function formatImprovement(improvement: number) {
  if (improvement > 100) {
    return chalk.greenBright(improvement.toFixed(2) + '%')
  }
  if (improvement > 25) {
    return chalk.green(improvement.toFixed(2) + '%')
  }
  if (improvement < 0) {
    return chalk.red(improvement.toFixed(2) + '%')
  }
  return chalk.yellow(improvement.toFixed(2) + '%')
}

function printRatios(avgImprovements: number[], medianImprovements: number[]) {
  console.log(
    'On average, the average improvement in query execution time in Orion v2 vs Orion v1 is: ',
    formatImprovement(_.mean(avgImprovements))
  )
  console.log(
    `The median of average improvement in query execution time in Orion v2 vs Orion v1 is: `,
    formatImprovement(median(avgImprovements))
  )
  console.log(
    `On average, the median improvement in query execution time in Orion v2 vs Orion v1 is: `,
    formatImprovement(_.mean(medianImprovements))
  )
  console.log(
    `The median of median improvement in query execution time in Orion v2 vs Orion v1 is:`,
    formatImprovement(median(medianImprovements))
  )
}

function calculateRows(data: unknown): number {
  if (!isObject(data)) {
    return -1
  }
  return Object.entries(data).reduce((totalRows, [qName, qResult]) => {
    if (isObject(qResult) && has(qResult, 'edges') && Array.isArray(qResult.edges)) {
      return totalRows + qResult.edges.length
    } else if (Array.isArray(qResult)) {
      return totalRows + qResult.length
    } else if (isObject(qResult)) {
      return totalRows + 1
    } else if (qResult === null) {
      return totalRows
    } else {
      console.error(`Unrecognized result on key ${qName}:`, qResult)
      throw new Error('Unexpected query result')
    }
  }, 0)
}

function printFinalResults(
  queryTimeCategories = [
    [0, Infinity],
    [0, 100],
    [101, 500],
    [501, 2000],
    [2000, Infinity],
  ]
) {
  for (const [min, max] of queryTimeCategories) {
    console.log(
      `========= QUERIES IN ${min}ms - ${
        max === Infinity ? 'Infinity' : `${max}ms`
      } RANGE =========`
    )
    const avgImprovements = testCases.flatMap(({ inputs }) =>
      inputs.flatMap(({ v1Results, v2Results }) => {
        const improvement =
          ((_.mean(v1Results) - _.mean(v2Results)) /
            Math.min(_.mean(v1Results), _.mean(v2Results))) *
          100

        return _.mean(v1Results) >= min && _.mean(v1Results) <= max ? [improvement] : []
      })
    )
    const medianImprovements = testCases.flatMap(({ inputs }) =>
      inputs.flatMap(({ v1Results, v2Results }) => {
        const improvement =
          ((median(v1Results) - median(v2Results)) /
            Math.min(median(v1Results), median(v2Results))) *
          100

        return _.mean(v1Results) >= min && _.mean(v1Results) <= max ? [improvement] : []
      })
    )
    console.log(`Tested queries in this range: ${avgImprovements.length}`)
    if (avgImprovements.length) {
      printRatios(avgImprovements, medianImprovements)
    }
  }
}

export async function benchmark() {
  const config: ApolloClientOptions<NormalizedCacheObject> = {
    cache: new InMemoryCache({ addTypename: false }),
    defaultOptions: {
      query: { fetchPolicy: 'no-cache', errorPolicy: 'all' },
      mutate: { fetchPolicy: 'no-cache', errorPolicy: 'all' },
    },
  }
  const orionV1Url = process.env.ORION_V1_URL
  const orionV2Url = process.env.ORION_V2_URL

  console.log(`Orion V1 endpoint: ${orionV1Url}`)
  console.log(`Orion V2 endpoint: ${orionV2Url}`)

  const orionV1Client = new ApolloClient({
    link: new HttpLink({
      uri: orionV1Url,
    }),
    uri: orionV1Url,
    ...config,
  })

  const orionV2Client = new ApolloClient({
    link: new HttpLink({
      uri: orionV2Url,
    }),
    ...config,
  })

  const executionsPerCase = 5

  for (const { v1Query, v2Query, inputs } of testCases) {
    for (const { v1Input, v2Input, v1Results, v2Results } of inputs) {
      let dataV1: unknown, dataV2: unknown
      for (let i = 0; i < executionsPerCase; ++i) {
        const startV1 = performance.now()
        dataV1 = (await orionV1Client.query({ query: v1Query, variables: v1Input })).data
        const endV1 = performance.now()
        v1Results.push(endV1 - startV1)
        const startV2 = performance.now()
        dataV2 = (await orionV2Client.query({ query: v2Query, variables: v2Input })).data
        const endV2 = performance.now()
        v2Results.push(endV2 - startV2)
      }
      const v1Rows = calculateRows(dataV1)
      const v2Rows = calculateRows(dataV2)
      const v1QueryName = (v1Query.definitions[0] as OperationDefinitionNode).name?.value
      const v2QueryName = (v2Query.definitions[0] as OperationDefinitionNode).name?.value
      console.log({
        v1Query: v1QueryName,
        v2Query: v2QueryName,
        v1Input,
        v2Input,
        v1Rows,
        v2Rows,
        v1Results,
        v2Results,
        v1Avg: _.mean(v1Results),
        v2Avg: _.mean(v2Results),
      })
      if (v1Rows !== v2Rows) {
        throw new Error('Number of rows returned does not match!')
      }
    }
  }
  printFinalResults()
}

benchmark()
  .then(() => process.exit(0))
  .catch(console.error)
