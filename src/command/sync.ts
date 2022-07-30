import * as vscode from 'vscode';
import axios from 'axios';
import * as fs from 'fs';
import { authentication } from 'vscode';
import configuration, { getRepoConfig } from '../shared/config';

const http = axios.create({
  baseURL: 'https://api.github.com/',
  timeout: 10000,
});

export const sync = async (url: vscode.Uri) => {
  if (!configuration['config.repo']) {
    await vscode.commands.executeCommand('hzfe-algorithms.config');
  }

  const repoConfig = getRepoConfig();
  if (!repoConfig?.owner || !repoConfig?.repo) {
    return await vscode.window.showErrorMessage('Repo url is invalid.');
  }

  const { owner, repo } = repoConfig;
  const account = await authentication.getSession('github', ['user:email', 'repo', 'write:discussion'], {
    createIfNone: true,
  });
  const issueList = await http.get(`/repos/${owner}/${repo}/issues`);
  // eslint-disable-next-line @typescript-eslint/naming-convention
  const list = issueList.data.filter((ele: { pull_request: any }) => !ele.pull_request);
  if (!list.length) {
    vscode.window.showErrorMessage('There are something went wrong.');
    return;
  }
  const number = list[0].number;
  const code = fs.readFileSync(url.path).toString();
  const codeGroups = /@lc app=leetcode id=(?<num>\d+) lang=(?<language>[^\n]+)/.exec(code)?.groups;

  const tpl = `
\`\`\`${codeGroups?.language}
${code}
\`\`\`
* * *
${configuration['config.nickname'] ? '> Nickname: ' + configuration['config.nickname'] : ''}
> From vscode-hzfe-algorithms`;

    const loadingText = `Syncing to [${owner}/${repo}]`;
    await vscode.window.withProgress({
      location: vscode.ProgressLocation.Notification,
      title: 'HZFE Algorithms',
    }, async (progress, token) => {
      let i = 0;
      const update = setInterval(() => {
        progress.report({ increment: i++ * 10, message: loadingText });
      }, 200);

      await http.post(
        `/repos/${owner}/${repo}/issues/${number}/comments`,
        {
          body: tpl,
        },
        {
          headers: {
            Authorization: `token ${account.accessToken}`,
          },
        },
      );

      clearInterval(update);
      progress.report({ increment: 100, message: 'successful' });
      await new Promise((r) => setTimeout(r, 3e3));
    });
};
