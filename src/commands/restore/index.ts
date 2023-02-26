import { Args, Flags } from '@oclif/core';
import axios from 'axios';
import yaml from 'js-yaml';
import { decompress } from 'lzutf8';
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { TPConfig, TPTemplate } from '../../utils/definitions';
import CustomCommand from '../../utils/oclif/custom-command';
import CustomError from '../../utils/oclif/custom-error';
import { DOBBY_CONFIG_FILE, DOBBY_TEMPLATES_FOLDER } from '../../utils/variables';
import { readYamlFile } from '../../utils/yaml';
import Start from '../start';

export default class Restore extends CustomCommand {
  static description = `Restore saved templates from "${DOBBY_CONFIG_FILE}"`;

  static examples = [
    '$ tp restore',
  ];

  static flags = {
    force: Flags.boolean({ description: 'If the template already installed, override the current installation.', aliases: ['f'], default: false }),
  };

  static args = {
    name: Args.string({ description: 'Specify the template name that will be restored.', required: false }),
  };

  async run(): Promise<void> {
    const { args, flags } = await this.parse(Restore);

    const currentPath = process.cwd();
    const configFilepath = join(currentPath, DOBBY_CONFIG_FILE);

    if (!existsSync(configFilepath))
      throw new CustomError(`You do not have a "${DOBBY_CONFIG_FILE}" in this current path. Are you in the correct folder?`);

    const configFile = await readYamlFile<TPConfig>(configFilepath)
    .then(config => TPConfig.parse(config));

    if (args.name)
      return this.restoreTemplateByName(configFile, args.name, flags.force);

    await Promise.all(
      Object.keys(configFile.templates).map(name => this.restoreTemplateByName(configFile, name, flags.force)),
    );

    this.log('All templates was restored!');
  }

  private async restoreTemplateByName(configFile: TPConfig, name: string, force: boolean): Promise<void> {
    const templateInfo = configFile.templates[name];

    if (templateInfo.startsWith('http'))
      return this.restoreTemplateByUrl(name, templateInfo, force);

    const decompressedTemplateInfo = decompress(templateInfo, {
      inputEncoding: 'Base64',
      outputEncoding: 'String',
    });
    const templateFolder = join(DOBBY_TEMPLATES_FOLDER, name);
    const alreadyExist = existsSync(templateFolder);

    if (alreadyExist && !force)
      return this.log(`Skipped "${name}", already installed.`);

    await Start.create(this.log.bind(this), name, decompressedTemplateInfo, force);
  }

  private async restoreTemplateByUrl(name: string, templateInfoUrl: string, force: boolean): Promise<void> {
    const tpStringTemplate = await axios.get<string>(templateInfoUrl, { responseType: 'text' })
    .then(res => res.data);

    const isValidYml = TPTemplate.safeParse(yaml.load(tpStringTemplate));

    if (!isValidYml.success)
      throw new CustomError(`The template file that you want to install is not valid. See more: ${isValidYml.error.message}`);

    await Start.create(this.log.bind(this), name, tpStringTemplate, force);
  }
}
