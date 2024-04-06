import * as exec from '@actions/exec'
import { context } from '@actions/github'
import { Config } from './config'

export async function stashChanges(): Promise<void> {
  await exec.exec('git', ['stash'])
}

export async function checkoutRef(ref: string): Promise<void> {
  await exec.exec('git', ['fetch', 'origin', ref])
  await exec.exec('git', ['checkout', ref])
}

export async function popStash(): Promise<boolean> {
  try {
    await exec.exec('git', ['stash', 'pop'])
    return true
  } catch (error) {
    return false
  }
}

/**
 * 
 * @returns the changes in the current branch as a string
 */
export async function getChanges(): Promise<string> {
  let changes = ''
  await exec.exec('git', ['diff', '--name-only'], {
    listeners: {
      stdout: (data: Buffer) => {
        changes += data.toString()
      }
    }
  })
  return changes
}