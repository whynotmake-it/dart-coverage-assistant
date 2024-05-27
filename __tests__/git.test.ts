import * as exec from '@actions/exec'
import { getChanges, popStash } from '../src/git'

describe('popStash', () => {
  it('should successfully pop the stash', async () => {
    const mockExec = jest
      .spyOn(exec, 'exec')
      .mockImplementation((_, __, options) => {
        return Promise.resolve(0)
      })

    const result = await popStash()

    expect(mockExec).toHaveBeenCalledWith('git', ['stash', 'pop'])
    expect(result).toBe(true)

    mockExec.mockRestore()
  })

  it('should return false if popping the stash fails', async () => {
    const mockExec = jest
      .spyOn(exec, 'exec')
      .mockImplementation((_, __, options) => {
        return Promise.reject(new Error('Failed to pop stash'))
      })

    const result = await popStash()

    expect(mockExec).toHaveBeenCalledWith('git', ['stash', 'pop'])
    expect(result).toBe(false)

    mockExec.mockRestore()
  })
})

describe('getChanges', () => {
  it('should return the list of changed files', async () => {
    // Mock the exec function
    const mockExec = jest
      .spyOn(exec, 'exec')
      .mockImplementation((_, __, options) => {
        options?.listeners?.stdout?.(Buffer.from('file1.txt\nfile2.txt\n'))
        return Promise.resolve(0)
      })

    const changes = await getChanges()

    expect(mockExec).toHaveBeenCalledWith(
      'git',
      ['diff', '--cached', '--name-only'],
      expect.any(Object)
    )
    expect(changes).toEqual('file1.txt\nfile2.txt\n')

    // Restore the original exec function
    mockExec.mockRestore()
  })
})
