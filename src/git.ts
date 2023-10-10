import * as exec from '@actions/exec'
import { context } from '@actions/github'
import { Config } from './config'
import { info } from 'console'

export async function configureGit(): Promise<void> {
  await exec.exec('git', ['config', 'user.name', 'github-actions[bot]'])
  await exec.exec('git', [
    'config',
    'user.email',
    'github-actions[bot]@users.noreply.github.com'
  ])
  const url = `https://x-access-token:${Config.githubToken}@github.com/${context.payload.repository?.full_name}`
  info(`url: ${url}`)
  await exec.exec('git', ['remote', 'set-url', 'origin', url])
}

export async function checkoutRef(ref: string): Promise<void> {
  await exec.exec('git', ['fetch', 'origin', ref])
  await exec.exec('git', ['checkout', ref])
}

export async function commitAndPushChanges(
  commitMessage: string
): Promise<void> {
  await exec.exec('git', ['add', '.'])
  await exec.exec('git', ['commit', '-am', commitMessage])
  await exec.exec('git', ['push', 'origin'])
}
