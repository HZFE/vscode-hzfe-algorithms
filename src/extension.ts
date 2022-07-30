import * as vscode from 'vscode';
import { codeLensController } from './codelen/CodeLensController';
import { sync } from './command/sync';
import { config } from './command/config';
// import getDaily from './command/getDaily';
// import createDailyStatusBar from './statusbar/createDailyStatusBar';

// let pending = false;

export async function activate(context: vscode.ExtensionContext) {
 const syncCommand = vscode.commands.registerCommand('hzfe-algorithms.sync', sync);
  const configCommand = vscode.commands.registerCommand('hzfe-algorithms.config', config);

  context.subscriptions.push(syncCommand, configCommand, codeLensController);

  // let dailyCommand = vscode.commands.registerCommand('do-something-right.getDaily', getDaily);
  // context.subscriptions.push(disposable, codeLensController, dailyCommand);
  // context.subscriptions.push(await createDailyStatusBar());
}

export function deactivate() {}
