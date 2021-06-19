# use-lambda-env

A quick CLI utility to grab environment variables from AWS Lambda functions, and execute shell commands with those environment variables.

Primary expected use-case: running a local development environment with config from a deployed lambda function, while avoiding the need to share secret files among developers.
Developers would be expected to simply have AWS CLI access configured (preferrably with short-lived credentials), with `Lambda:GetFunction` permission to read the lambda
function, along with `KMS:Decrypt` access to the environment variable encryption key used for the function (if applicable).

## Example usage

```bash
use-lambda-env --region ap-southeast-2 your-function-name node index.js
```

I'd recommend putting the above in a script in package.json, so that developers don't need to remember it, and so you can update the function name for all developers easily when needed.

## Contributing

This repository uses `semantic-release`. Please use the [semantic commit message format] for any contributions.

Code style / formatting is handled by [ts-standard] - please run `npm run lint:fix` to auto-fix your code before committing.

[semantic commit message format]: https://github.com/semantic-release/semantic-release#commit-message-format
[ts-standard]: https://github.com/standard/ts-standard
