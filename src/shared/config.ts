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

const configuration = workspace.getConfiguration(pkg.name);

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
const config: TConfig = new Proxy(configuration, {
  get (target, prop: string) {
    if (configuration.get(prop)) {
      return configuration.get(prop);
    }

    // @ts-ignore
    return target[prop];
  }
}) as any;

export const getRepoConfig: () => { owner: string, repo: string } = () => /github.com[\/:](?<owner>[\w-]+)\/(?<repo>[\w-]+)/.exec(config['config.repo'])?.groups as any;

export default config;
