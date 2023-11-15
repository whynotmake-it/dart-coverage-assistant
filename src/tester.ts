import * as exec from '@actions/exec'
import { Config } from './config'
import * as core from '@actions/core'

export async function tryRunTestCommand(mustSucceed?: boolean): Promise<void> {
  const testCommand = Config.testCommand
  if (!testCommand) {
    return
  }

  const output = await exec.getExecOutput(testCommand)
  core.info(output.stdout)
  if (output.exitCode) {
    core.warning(output.stderr)
    if (mustSucceed) {
      core.setFailed(`Test command '${testCommand}' failed`)
      throw new Error(`Test command '${testCommand}' failed`)
    }
  }
}
