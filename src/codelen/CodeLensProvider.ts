import * as vscode from "vscode";
import { getRepoConfig } from "../shared/config";

export class CustomCodeLensProvider implements vscode.CodeLensProvider {
  private onDidChangeCodeLensesEmitter: vscode.EventEmitter<
    void
  > = new vscode.EventEmitter<void>();

  get onDidChangeCodeLenses(): vscode.Event<void> {
    return this.onDidChangeCodeLensesEmitter.event;
  }

  public refresh(): void {
    this.onDidChangeCodeLensesEmitter.fire();
  }

  public provideCodeLenses(
    document: vscode.TextDocument
  ): vscode.ProviderResult<vscode.CodeLens[]> {
    const shortcuts: string[] = ["Sync"];
    if (!shortcuts) {
      return;
    }
    const content: string = document.getText();
    const matchResult: RegExpMatchArray | null = content.match(
      /@lc app=.* id=(.*) lang=.*/
    );
    if (!matchResult) {
      return undefined;
    }
    let codeLensLine: number = document.lineCount - 1;
    for (let i: number = document.lineCount - 1; i >= 0; i--) {
      const lineContent: string = document.lineAt(i).text;
      if (lineContent.indexOf("@lc code=end") >= 0) {
        codeLensLine = i;
        break;
      }
    }
    const range: vscode.Range = new vscode.Range(
      codeLensLine,
      0,
      codeLensLine,
      0
    );
    const codeLens: vscode.CodeLens[] = [];

    const { repo } = getRepoConfig();
    console.log({repoConfigrepoConfigrepoConfigrepoConfig:getRepoConfig()})
    if (shortcuts.indexOf("Sync") >= 0) {
      codeLens.push(
        new vscode.CodeLens(range, {
          title: `Sync to ${`[${repo}]` || 'Repo'}`,
          command: 'hzfe-algorithms.sync',
          arguments: [document.uri],
        })
      );
    }
    return codeLens;
  }
}

export const customCodeLensProvider: CustomCodeLensProvider = new CustomCodeLensProvider();
