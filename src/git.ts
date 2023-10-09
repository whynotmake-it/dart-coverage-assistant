import * as exec from '@actions/exec';

export async function configureGit() {
    await exec.exec('git', ['config', 'user.name', 'github-actions[bot]']);
    await exec.exec('git', ['config', 'user.email', 'github-actions[bot]@users.noreply.github.com']);
}

export async function commitAndPushChanges(commitMessage: string) {
    await exec.exec('git', ['add', '.']);
    await exec.exec('git', ['commit', '-m', commitMessage]);
    await exec.exec('git', ['push']);
}
