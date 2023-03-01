import { Args, Flags, ux } from '@oclif/core';
import { FlagOutput } from '@oclif/core/lib/interfaces/parser';
import { existsSync } from 'node:fs';
import { readdir } from 'node:fs/promises';
import { join } from 'node:path';
import { TPConfig, TPTemplate } from '../../utils/definitions';
import { findTPTemplateByName } from '../../utils/functions';
import CustomCommand from '../../utils/oclif/custom-command';
import CustomError from '../../utils/oclif/custom-error';
import { TP_CONFIG_FILE, TP_TEMPLATES_FOLDER } from '../../utils/variables';
import { readYamlFile } from '../../utils/yaml';

export default class List extends CustomCommand {
  static description = 'List installed templates';

  static aliases = [
    'ls',
  ];

  static examples = [
    '$ tp ls',
    '$ tp list',
    '$ tp ls my-api',
    '$ tp list my-api',
  ];

  static flags = {
    ...ux.table.flags(),
    locally: Flags.boolean({ description: 'Just list the templates that are installed locally.', required: false, aliases: ['l'] }),
  };

  static args = {
    name: Args.string({ description: 'Specify the model name to list what this template can generate.', required: false }),
  };

  async run(): Promise<TPTemplate[]> {
    const { flags, args } = await this.parse(List);

    if (!args.name)
      return this.listAllTemplates(flags.locally, flags);

    return [await this.listAllForTemplate(args.name, flags)];
  }

  private async listAllTemplates(locally: boolean, flags: FlagOutput): Promise<TPTemplate[]> {
    let templateFolders = [];

    if (locally) {
      const currentPath = process.cwd();
      const tpConfigPath = join(currentPath, TP_CONFIG_FILE);

      if (!existsSync(tpConfigPath))
        throw new CustomError(`In order to be able to list the locally installed features, you must first generate the "${TP_CONFIG_FILE}" with "tp local <template-name>".`);

      const tpConfig = await readYamlFile(tpConfigPath).then(config => TPConfig.parse(config));

      templateFolders = Object.keys(tpConfig.templates);
    } else {
      templateFolders = await readdir(TP_TEMPLATES_FOLDER);
    }

    return Promise.all(
      templateFolders.map(async (templateName, index) => {
        const result = await this.listAllForTemplate(templateName, flags);

        if (index < (templateFolders.length - 1))
          this.log('');

        return result;
      }),
    );
  }

  private async listAllForTemplate(templateName: string, flags: FlagOutput): Promise<TPTemplate> {
    const matchTemplate = await findTPTemplateByName(templateName);

    const generates = Object.keys(matchTemplate.generate || {}).map(generate => {
      const options = matchTemplate.generate[generate]!;

      return {
        name: generate,
        description: options.description,
      };
    });

    ux.table(generates, {
      name: {
        minWidth: 7,
        header: `(${templateName}) Name`,
      },
      description: {},
    }, {
      printLine: this.log.bind(this),
      ...flags, // parsed flags
    });

    return matchTemplate;
  }
}
