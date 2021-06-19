import nock from 'nock'
import cp from 'child_process'
import { useLambdaEnv } from './use-lambda-env'

nock.disableNetConnect()

const spawnSync = jest.spyOn(cp, 'spawnSync').mockReturnValue({
  status: 0
} as any)

const processExit = jest.spyOn(process, 'exit').mockImplementation(jest.fn() as any)

test('success', async () => {
  nock('https://lambda.ap-southeast-2.amazonaws.com')
    .get('/2015-03-31/functions/my-function').reply(200, {
      Configuration: {
        Environment: {
          Variables: {
            abc: 'def',
            test: '123'
          }
        }
      }
    })
  await useLambdaEnv('my-function', ['my-command'], 'ap-southeast-2')
  expect(spawnSync).toHaveBeenCalledWith('my-command', [], {
    stdio: 'inherit',
    env: {
      AWS_REGION: 'ap-southeast-2',
      ...process.env,
      abc: 'def',
      test: '123'
    }
  })
  expect(processExit).toHaveBeenCalledWith(0)
})

test('error decrypting environment variables', async () => {
  nock('https://lambda.ap-southeast-2.amazonaws.com')
    .get('/2015-03-31/functions/my-function').reply(200, {
      Configuration: {
        Environment: {
          Error: {
            Message: 'missing kms decrypt permission'
            // that's not the actual error message, but you get the idea
          }
        }
      }
    })
  await expect(
    useLambdaEnv('my-function', ['my-command'], 'ap-southeast-2')
  ).rejects.toThrow('missing kms decrypt permission')
})

test('missing region config', async () => {
  delete process.env.AWS_REGION
  await expect(useLambdaEnv('test', ['command'])).rejects.toThrow('Region is missing')
})
