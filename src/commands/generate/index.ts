import { Args, Flags } from '@oclif/core';
import axios from 'axios';
import { existsSync } from 'node:fs';
import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import prompts from 'prompts';
import { TPConfig, TPStructureItem } from '../../utils/definitions';
import { findTPTemplateByName } from '../../utils/functions';
import CustomCommand from '../../utils/oclif/custom-command';
import CustomError from '../../utils/oclif/custom-error';
import { DOBBY_CONFIG_FILE } from '../../utils/variables';
import { replaceTextWithWildcards } from '../../utils/wildcards';
import { readYamlFile } from '../../utils/yaml';

export default class Generate extends CustomCommand {
  static description = 'Generate some resource from templates.';

  static aliases = [
    'g',
  ];

  static examples = [
    '$ tp generate <resource> <name>',
    '$ tp g <resource> <name>',
    '$ tp g <resource> <name> --template <my-template>',
  ];

  static flags = {
    force: Flags.boolean({ description: 'If the files already generated, override the content.', aliases: ['f'], default: false }),
    template: Flags.string({ description: 'Specify the template we will look for to generate the feature.', aliases: ['t'] }),
    path: Flags.string({ description: 'Specify the base path that will be used during creation.', aliases: ['p'] }),
  };

  static args = {
    resource: Args.string({ description: 'Specify the resource that will be generated.', required: true }),
    name: Args.string({ description: 'Specify the name of this new resource.', required: true }),
  };

  async run(): Promise<void> {
    const { args, flags } = await this.parse(Generate);

    const currentPath = process.cwd();
    const tpConfigPath = join(currentPath, DOBBY_CONFIG_FILE);

    if (!existsSync(tpConfigPath))
      throw new CustomError('To be able to generate some resource, you should first mark the ');

    const tpConfig = await readYamlFile(tpConfigPath).then(config => TPConfig.parse(config));
    const validTemplates = flags.template ? [flags.template] : Object.keys(tpConfig.templates);

    const tpTemplates = await Promise.all(
      validTemplates.map(async templateName => [templateName, await findTPTemplateByName(templateName)] as const),
    );

    const templates = tpTemplates.filter(template => !!template[1].generate[args.resource]);

    if (templates.length === 0)
      throw new CustomError(`We couldn't find a resource named "${args.resource}", please check that you wrote it correctly. If you don't know what you can generate, run "tp ls --locally"`);

    const { selectedTemplate } = templates.length === 1 ?
      { selectedTemplate: templates[0][1] } :
      await prompts({
        type: 'select',
        name: 'selectedTemplate',
        message: 'I found the resource in more than one template, which one do you want to use?',
        choices: templates.map(([templateName, template]) => {
          return {
            title: templateName,
            value: template,
          };
        }),
      });

    const resource = selectedTemplate.generate[args.resource]!;
    const filePaths = Object.keys(resource.structure);

    for (const filePath of filePaths) {
      if (!resource.structure)
        continue;

      const originalContent = await this.getContentOfResource(resource.structure[filePath]).catch(() => null);

      if (originalContent === null)
        throw new CustomError(`Could not load the contents of the file path "${filePath}", please check that the contents are valid or that the URL is accessible.`);

      const content = replaceTextWithWildcards(originalContent, args.name);
      const filePathToWrite = replaceTextWithWildcards(join(flags.path || '', filePath), args.name);
      const directory = dirname(filePathToWrite);

      if (directory !== '.') {
        await mkdir(directory, {
          recursive: true,
        });
      }

      if (!flags.force && existsSync(filePathToWrite))
        throw new CustomError(`The file in the path ${filePathToWrite} already exist! If you want to overwrite, call this command with flag "-f".`);

      this.log(`Writing ${filePathToWrite}...`);
      await writeFile(filePathToWrite, content);
    }
  }

  private async getContentOfResource(structureItem: TPStructureItem): Promise<string> {
    if ('content' in structureItem) {
      return structureItem.content;
    }

    return axios.get(structureItem.url, { responseType: 'text' }).then(res => res.data);
  }
}
