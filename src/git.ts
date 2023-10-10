import * as exec from '@actions/exec'

export async function configureGit(): Promise<void> {
  await exec.exec('git', ['config', 'user.name', 'github-actions[bot]'])
  await exec.exec('git', [
    'config',
    'user.email',
    'github-actions[bot]@users.noreply.github.com'
  ])
}

export async function checkout(branch: string): Promise<void> {
  // Checkout the branch while keeping local changes
  await exec.exec('git', ['checkout', branch, '--'])
}

export async function commitAndPushChanges(
  commitMessage: string
): Promise<void> {
  await exec.exec('git', ['add', '.'])
  await exec.exec('git', ['commit', '-m', commitMessage])
  await exec.exec('git', ['push', 'origin'])
}
