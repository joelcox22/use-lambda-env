import cac from 'cac'
import * as fs from 'fs'
import { useLambdaEnv } from './use-lambda-env'

export const cli = cac('use-lambda-env')

const { version } = JSON.parse(fs.readFileSync(`${__dirname}/../package.json`, 'utf-8'))

cli.help()
cli.version(version)

cli
  .command('<lambdaFunction> <...command>')
  .option('--region <region>', 'Which region your lambda function lives in')
  .allowUnknownOptions()
  .action(async (functionName: string) => {
    // a little bit of tricky option parsing, because
    // variadic arguments makes things dificult :(
    const functionNameIndex = cli.rawArgs.indexOf(functionName)
    const command = cli.rawArgs.slice(functionNameIndex + 1)
    const optionArgs = cli.rawArgs.slice(0, functionNameIndex)
    let region: string | undefined
    optionArgs.forEach((arg, index) => {
      if (arg === '--region') {
        region = optionArgs[index + 1]
      }
    })

    try {
      await useLambdaEnv(functionName, command, region ?? process.env.AWS_REGION)
    } catch (err) {
      console.log(err.message)
      process.exit(1)
    }
  })

cli.example('use-lambda-env my-function node index.js')
cli.example('use-lambda-env --region ap-southeast-2 my-function node index.js')
