import { Args, Flags } from '@oclif/core';
import yaml from 'js-yaml';
import { compress } from 'lzutf8';
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { TPConfig, TPTemplate } from '../../utils/definitions';
import { findTPTemplateContentByName } from '../../utils/functions';
import CustomCommand from '../../utils/oclif/custom-command';
import { TP_CONFIG_FILE } from '../../utils/variables';
import { readYamlFile, writeYamlFile } from '../../utils/yaml';

export default class Local extends CustomCommand {
  static description = 'Save the template reference inside ".tp.yml" so you can restore it later to use the same template on other machines.';

  static aliases = [
    'l',
  ];

  static examples = [
    '$ tp l test',
    '$ tp local test',
  ];

  static flags = {
    full: Flags.boolean({ description: 'Instead use "installUrl", save the entire template locally.', default: false }),
  };

  static args = {
    name: Args.string({ description: 'Specify the template name that will be saved locally.', required: true }),
  };

  async run(): Promise<void> {
    const { args, flags } = await this.parse(Local);

    const tpTemplateContent = await findTPTemplateContentByName(args.name);
    const tpTemplateCompressed = compress(tpTemplateContent, {
      inputEncoding: 'String',
      outputEncoding: 'Base64',
    });

    if (flags.full)
      return this.toLocal(args.name, tpTemplateCompressed);

    const tpTemplate = TPTemplate.parse(yaml.load(tpTemplateContent));

    return this.toLocal(args.name, tpTemplate.installUrl || tpTemplateCompressed);
  }

  private async toLocal(name: string, url: string): Promise<void> {
    const currentPath = process.cwd();
    const configFilepath = join(currentPath, TP_CONFIG_FILE);

    let configFile: TPConfig = {
      templates: {},
    };

    const configFileExist = existsSync(configFilepath);

    if (configFileExist)
      configFile = await readYamlFile(configFilepath).then(data => TPConfig.parse(data));

    configFile.templates[name] = url;

    await writeYamlFile(configFilepath, configFile);

    this.log(`The template ${name} was saved at ${TP_CONFIG_FILE}.`);
  }
}
