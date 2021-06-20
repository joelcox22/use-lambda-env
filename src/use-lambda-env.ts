import * as cp from 'child_process'
import * as lambda from '@aws-sdk/client-lambda'

async function getLambdaEnv (functionName: string, region?: string): Promise<NodeJS.ProcessEnv> {
  const clientOptions: lambda.LambdaClientConfig = {}
  if (typeof region === 'string') {
    clientOptions.region = region
  }

  const client = new lambda.LambdaClient(clientOptions)
  const data = await client.send(new lambda.GetFunctionCommand({
    FunctionName: functionName
  }))

  const err = data.Configuration?.Environment?.Error?.Message
  if (typeof err === 'string') {
    throw new Error(err)
  }

  return {
    AWS_REGION: region,
    ...(data.Configuration?.Environment?.Variables)
  }
}

export async function useLambdaEnv (functionName: string, command: string[], region?: string): Promise<never> {
  const result = cp.spawnSync(command[0], command.slice(1), {
    stdio: 'inherit',
    env: await getLambdaEnv(functionName, region)
  })
  process.exit(result.status ?? 1)
}

export async function showLambdaEnv (functionName: string, region?: string): Promise<never> {
  console.log(await getLambdaEnv(functionName, region))
  process.exit(0)
}
