import * as cp from 'child_process'
import * as lambda from '@aws-sdk/client-lambda'

export async function useLambdaEnv (functionName: string, command: string[], region?: string): Promise<never> {
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

  const env: NodeJS.ProcessEnv = {
    AWS_REGION: region ?? process.env.AWS_REGION,
    ...process.env,
    ...(data.Configuration?.Environment?.Variables ?? {})
  }

  const result = cp.spawnSync(command[0], command.slice(1), {
    stdio: 'inherit',
    env
  })

  process.exit(result.status ?? 1)
}
