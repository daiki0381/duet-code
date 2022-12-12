# frozen_string_literal: true

module GithubStub
  def github_repos_stub
    allow_any_instance_of(Octokit::Client).to receive(:repos).and_return(
      [
        double('repo', name: 'repo1')
      ]
    )
  end

  def github_pulls_stub
    allow_any_instance_of(Octokit::Client).to receive(:pulls).and_return([
                                                                           double('pull',
                                                                                  head: double('head', repo: double('repo', name: 'repo1')),
                                                                                  title: 'title1', html_url: 'url1', user: double('user', login: 'login1'))
                                                                         ])
  end

  def github_add_collaborator_stub
    allow_any_instance_of(Octokit::Client).to receive(:add_collaborator).and_return(true)
  end

  def github_repository_invitations_stub
    allow_any_instance_of(Octokit::Client).to receive(:repository_invitations).and_return([])
  end

  def github_accept_repository_invitation_stub
    allow_any_instance_of(Octokit::Client).to receive(:accept_repository_invitation).and_return(true)
  end

  def github_request_pull_request_review_stub
    allow_any_instance_of(Octokit::Client).to receive(:request_pull_request_review).and_return(true)
  end

  def github_add_reviewer_stub
    github_add_collaborator_stub
    github_repository_invitations_stub
    github_accept_repository_invitation_stub
    github_request_pull_request_review_stub
  end
end
