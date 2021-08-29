import cac from 'cac';
import * as fs from 'fs';
import * as path from 'path';
import { useLambdaEnv, showLambdaEnv } from './use-lambda-env';

export const cli = cac('use-lambda-env');

const { version } = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'package.json'), 'utf-8'));

cli.help();
cli.version(version);

function customParse(functionName: string): {
  command: string[];
  region?: string;
} {
  // a little bit of tricky option parsing, because
  // variadic arguments makes things dificult :(
  const functionNameIndex = cli.rawArgs.indexOf(functionName);
  const command = cli.rawArgs.slice(functionNameIndex + 1);
  const optionArgs = cli.rawArgs.slice(0, functionNameIndex);
  let region: string | undefined;
  optionArgs.forEach((arg, index) => {
    if (arg === '--region') {
      region = optionArgs[index + 1];
    }
  });
  return {
    command,
    region: region ?? process.env.AWS_REGION,
  };
}

cli.option('--region <region>', 'Which region your lambda function lives in');

cli
  .command('<lambdaFunction> <...command>')
  .allowUnknownOptions()
  .action(async (functionName: string) => {
    try {
      const { command, region } = customParse(functionName);
      await useLambdaEnv(functionName, command, region);
    } catch (err) {
      if (err instanceof Error) console.log(err.message);
      process.exit(1);
    }
  });

cli.command('show <lambdaFunction>').action(async (functionName: string) => {
  try {
    const { region } = customParse(functionName);
    await showLambdaEnv(functionName, region);
  } catch (err) {
    if (err instanceof Error) console.log(err.message);
    process.exit(1);
  }
});

cli.example('use-lambda-env my-function node index.js');
cli.example('use-lambda-env --region ap-southeast-2 my-function node index.js');
