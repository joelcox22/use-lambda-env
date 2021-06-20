import { cli } from './cli'
import * as useLambdaEnv from './use-lambda-env'

const use = jest.spyOn(useLambdaEnv, 'useLambdaEnv')
const show = jest.spyOn(useLambdaEnv, 'showLambdaEnv')
const consoleLog = jest.spyOn(console, 'log')
const processExit = jest.spyOn(process, 'exit')
use.mockImplementation(jest.fn())
show.mockImplementation(jest.fn())
consoleLog.mockImplementation(jest.fn())
processExit.mockImplementation(jest.fn() as any)

afterEach(() => {
  jest.resetAllMocks()
})

beforeEach(() => {
  delete process.env.AWS_REGION
})

const exec = (...args: string[]): any => cli.parse(['node', 'use-lambda-env', ...args])

test('basic usage', () => {
  exec('my-function', 'env')
  expect(use).toHaveBeenCalledWith('my-function', ['env'], undefined)
})

test('complex command', () => {
  exec('test-function', 'bash', '-c', 'env | grep test')
  expect(use).toHaveBeenCalledWith('test-function', ['bash', '-c', 'env | grep test'], undefined)
})

test('region argument', () => {
  exec('--region', 'ap-southeast-2', 'region-function', 'hello')
  expect(use).toHaveBeenCalledWith('region-function', ['hello'], 'ap-southeast-2')
})

test('region ignored from command', () => {
  exec('region-function', 'hello', '--region', 'ap-southeast-2')
  expect(use).toHaveBeenCalledWith('region-function', ['hello', '--region', 'ap-southeast-2'], undefined)
})

test('region from environment variable', () => {
  process.env.AWS_REGION = 'us-east-1'
  exec('abc', 'def')
  expect(use).toHaveBeenCalledWith('abc', ['def'], 'us-east-1')
})

test('region flag takes priority over environment variable', () => {
  process.env.AWS_REGION = 'us-east-1'
  exec('--region', 'ap-southeast-2', 'abc', 'def')
  expect(use).toHaveBeenCalledWith('abc', ['def'], 'ap-southeast-2')
})

test('conflicting region option and command', () => {
  exec('--region', 'us-east-1', 'test', 'abc', '--region', 'us-east-2')
  expect(use).toHaveBeenCalledWith('test', ['abc', '--region', 'us-east-2'], 'us-east-1')
})

test('handling an error', () => {
  use.mockImplementation(() => {
    throw new Error('example error')
  })
  exec('a', 'b')
  expect(consoleLog).toHaveBeenCalledWith('example error')
  expect(processExit).toHaveBeenCalledWith(1)
})

test('show environment variables', () => {
  exec('show', 'my-function')
  expect(show).toHaveBeenCalledWith('my-function', undefined)
  expect(use).not.toHaveBeenCalled()
})

test('show failing', () => {
  show.mockImplementation(() => {
    throw new Error('test error')
  })
  exec('show', 'a')
  expect(consoleLog).toHaveBeenCalledWith('test error')
  expect(processExit).toHaveBeenCalledWith(1)
})
