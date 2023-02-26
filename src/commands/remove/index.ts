import { Args } from '@oclif/core';
import { existsSync } from 'node:fs';
import { rm } from 'node:fs/promises';
import { join } from 'node:path';
import CustomCommand from '../../utils/oclif/custom-command';
import CustomError from '../../utils/oclif/custom-error';
import { DOBBY_TEMPLATES_FOLDER } from '../../utils/variables';

export default class Remove extends CustomCommand {
  static description = 'Remove an installed template.';

  static aliases = [
    'rm',
  ]

  static examples = [
    '$ tp remove <name>',
  ];

  static flags = {};

  static args = {
    name: Args.string({ description: 'Specify the template name that will be removed.', required: false }),
  };

  async run(): Promise<void> {
    const { args } = await this.parse(Remove);
    const pathToRemove = join(DOBBY_TEMPLATES_FOLDER, args.name || '');

    if (!existsSync(pathToRemove))
      throw new CustomError(`The template with name "${args.name}" was not found at "${DOBBY_TEMPLATES_FOLDER}"`);

    await rm(pathToRemove, {
      force: true,
      recursive: true,
    });

    this.log('Template removed successfully!');
  }
}
