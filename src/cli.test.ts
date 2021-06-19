import { cli } from './cli'
import * as useLambdaEnv from './use-lambda-env'

const spy = jest.spyOn(useLambdaEnv, 'useLambdaEnv')
spy.mockImplementation(jest.fn())

afterEach(() => {
  jest.resetAllMocks()
})

beforeEach(() => {
  delete process.env.AWS_REGION
})

const exec = (...args: string[]): any => cli.parse(['node', 'use-lambda-env', ...args])

test('basic usage', () => {
  exec('my-function', 'env')
  expect(spy).toHaveBeenCalledWith('my-function', ['env'], undefined)
})

test('complex command', () => {
  exec('test-function', 'bash', '-c', 'env | grep test')
  expect(spy).toHaveBeenCalledWith('test-function', ['bash', '-c', 'env | grep test'], undefined)
})

test('region argument', () => {
  exec('--region', 'ap-southeast-2', 'region-function', 'hello')
  expect(spy).toHaveBeenCalledWith('region-function', ['hello'], 'ap-southeast-2')
})

test('region ignored from command', () => {
  exec('region-function', 'hello', '--region', 'ap-southeast-2')
  expect(spy).toHaveBeenCalledWith('region-function', ['hello', '--region', 'ap-southeast-2'], undefined)
})

test('region from environment variable', () => {
  process.env.AWS_REGION = 'us-east-1'
  exec('abc', 'def')
  expect(spy).toHaveBeenCalledWith('abc', ['def'], 'us-east-1')
})

test('region flag takes priority over environment variable', () => {
  process.env.AWS_REGION = 'us-east-1'
  exec('--region', 'ap-southeast-2', 'abc', 'def')
  expect(spy).toHaveBeenCalledWith('abc', ['def'], 'ap-southeast-2')
})

test('conflicting region option and command', () => {
  exec('--region', 'us-east-1', 'test', 'abc', '--region', 'us-east-2')
  expect(spy).toHaveBeenCalledWith('test', ['abc', '--region', 'us-east-2'], 'us-east-1')
})

test('handling an error', () => {
  const consoleLog = jest.spyOn(console, 'log').mockImplementation(jest.fn())
  const processExit = jest.spyOn(process, 'exit').mockImplementation(jest.fn() as any)
  spy.mockImplementation(() => {
    throw new Error('example error')
  })
  exec('a', 'b')
  expect(consoleLog).toHaveBeenCalledWith('example error')
  expect(processExit).toHaveBeenCalledWith(1)
})
