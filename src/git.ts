import * as exec from '@actions/exec'
import { context } from '@actions/github'
import { Config } from './config'

export async function configureGit(): Promise<void> {
  await exec.exec('git', ['config', 'user.name', 'github-actions[bot]'])
  await exec.exec('git', [
    'config',
    'user.email',
    'github-actions[bot]@users.noreply.github.com'
  ])
  const url = `https://x-access-token:${Config.githubToken}@github.com/${context.payload.repository?.full_name}`
  await exec.exec('git', ['remote', 'set-url', 'origin', url])
}

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

export async function commitAndPushChanges(
  commitMessage: string
): Promise<void> {
  await exec.exec('git', ['add', '.'])
  await exec.exec('git', ['commit', '-am', commitMessage])
  await exec.exec('git', ['push', 'origin'])
}
