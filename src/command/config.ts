import * as vscode from 'vscode';
import configuration, { extentionConfig } from '../shared/config';

export const config = async () => {
  const repo = await vscode.window.showInputBox({
    value: configuration['config.repo'],
    placeHolder: extentionConfig['config.repo']['description'],
  });
  await configuration.update('config.repo', repo, true);

  const nickname = await vscode.window.showInputBox({
    value: configuration['config.nickname'],
    placeHolder: extentionConfig['config.nickname'].description,
  });
  await configuration.update('config.nickname', nickname, true);
};
