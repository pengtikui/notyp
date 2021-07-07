import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';
import merge from 'lodash.merge';
import get from 'lodash.get';
import set from 'lodash.set';

type ConfigType = string | number | ConfigObject;

interface ConfigObject {
  [key: string]: ConfigType;
}

export class Config {
  private configPath = path.resolve(process.cwd(), 'config');
  private env = process.env.NODE_ENV || 'development';

  private realConfig: ConfigObject = {};

  constructor() {
    this.loadConfig();
  }

  private loadYamlConfig(filename: string): ConfigObject {
    const fullPath = path.resolve(this.configPath, filename);
    if (!fs.existsSync(fullPath)) {
      return {};
    }
    const content = yaml.load(fs.readFileSync(fullPath).toString());
    return typeof content === 'object' ? (content as ConfigObject) : {};
  }

  private loadConfig() {
    const defaultConfig = this.loadYamlConfig('default.yml');
    const currentConfig = this.loadYamlConfig(`${this.env}.yml`);
    this.realConfig = merge(defaultConfig, currentConfig);
  }

  /**
   * get config
   * @param {string} key config key
   */
  public get<T = ConfigType>(key: string): T {
    return get(this.realConfig, key) as any;
  }

  /**
   * set config
   * @param {string} key config key
   * @param {string} value config value
   */
  public set(key: string, value: ConfigType): void {
    set(this.realConfig, key, value);
  }
}
