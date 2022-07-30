import { ConfigurationTarget, workspace, WorkspaceConfiguration } from "vscode";
// @ts-ignore
import * as pkg from '../../package.json';

type RemovePrefix<T> = T extends `${infer A}.${infer B}.${infer C}` ? `${B}.${C}` : T;

export type TExtensionConfig = RemovePrefix<keyof (typeof pkg)['contributes']['configuration']['properties']>;
export const extentionConfig = {} as Record<TExtensionConfig, any>;

// export type TExtensionCommand = (typeof pkg)['contributes']['commands'][number]['command'];

export const props = pkg['contributes']['configuration']['properties'];
export const CONF_KEY = {} as Record<Uppercase<TExtensionConfig>, string>;
Object.keys(props).forEach(key => {
  (CONF_KEY as any)[key.toUpperCase()] = key;
  extentionConfig[key.split('.').slice(1).join('.') as TExtensionConfig] = (props as any)[key];
});

type TConfig = WorkspaceConfiguration
  & Record<TExtensionConfig, any>
  & {
    update(
      section: TExtensionConfig,
      value: any,
      configurationTarget?: ConfigurationTarget | boolean | null,
      overrideInLanguage?: boolean
    ): Thenable<void>;
  };
const config: TConfig = new Proxy({}, {
  get (_, prop: string) {
    const c = workspace.getConfiguration(pkg.name);
    if (c.get(prop)) {
      return c.get(prop);
    }

    // @ts-ignore
    return c[prop];
  }
}) as any;

export const githubRepoReg = /github.com[\/:](?<owner>[\w-]+)\/(?<repo>[\w-]+)/;
export const getRepoConfig: () => { owner: string, repo: string } = () => githubRepoReg.exec(config['config.repo'])?.groups as any;

export default config;
