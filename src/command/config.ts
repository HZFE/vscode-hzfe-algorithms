import * as vscode from 'vscode';
import configuration, { extentionConfig, githubRepoReg } from '../shared/config';

export const config = async () => {
  const repo = await vscode.window.showInputBox({
    title: extentionConfig['config.repo'].description,
    value: configuration['config.repo'],
    placeHolder: extentionConfig['config.repo'].description,
    validateInput: (val) => {
      return githubRepoReg.test(val) ? null : 'Repo url is invalid.';
    }
  });
  await configuration.update('config.repo', repo, true);

  const nickname = await vscode.window.showInputBox({
    title: extentionConfig['config.nickname'].description,
    value: configuration['config.nickname'],
    placeHolder: extentionConfig['config.nickname'].description,
  });
  await configuration.update('config.nickname', nickname, true);
};
