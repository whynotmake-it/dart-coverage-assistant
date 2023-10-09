import { getOctokit } from '@actions/github'
import { Context } from '@actions/github/lib/context'
import { Config } from './config'
import { GitHub } from '@actions/github/lib/utils'

const hiddenHeader = '<!-- dart-coverage-assistant -->'

export class CommentsService {
  constructor(private readonly octokit: InstanceType<typeof GitHub>) {}

  /**
   * Adds a invisible header to the comment, so that it can be identified later.
   * @param comment the comment that the header should be added to
   * @returns The new comment including the header
   */
  private addHeaderToComment(comment: String): String {
    return comment + hiddenHeader
  }
}
