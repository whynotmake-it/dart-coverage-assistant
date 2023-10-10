import * as exec from '@actions/exec'

export async function configureGit(): Promise<void> {
  await exec.exec('git', ['config', 'user.name', 'github-actions[bot]'])
  await exec.exec('git', [
    'config',
    'user.email',
    'github-actions[bot]@users.noreply.github.com'
  ])
}

export async function checkout(ref: string): Promise<void> {
  // Checkout the branch while keeping local changes
  await exec.exec('git', ['branch', '-a'], { outStream: process.stdout })
  try {
    await exec.exec('git', ['stash'])
  } catch (error) {
    // No local changes to stash
  }
  await exec.exec('git', ['checkout', `${ref.replace('refs/', 'remotes/')}`])
  try {
    await exec.exec('git', ['stash', 'pop'])
  } catch (error) {
    // No stash to pop
  }
}

export async function commitAndPushChanges(
  commitMessage: string
): Promise<void> {
  await exec.exec('git', ['add', '.'])
  await exec.exec('git', ['commit', '-am', commitMessage])
  await exec.exec('git', ['push', 'origin'])
}
