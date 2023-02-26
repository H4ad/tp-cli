import { Args } from '@oclif/core';
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import openFolder from 'open';
import CustomCommand from '../../utils/oclif/custom-command';
import CustomError from '../../utils/oclif/custom-error';
import { DOBBY_TEMPLATES_FOLDER } from '../../utils/variables';

export default class Open extends CustomCommand {
  static description = 'Open the folder where templates are saved.';

  static examples = [
    '$ tp open test',
  ];

  static flags = {};

  static args = {
    name: Args.string({ description: 'Specify the template name that will be opened.', required: false }),
  };

  async run(): Promise<void> {
    const { args } = await this.parse(Open);
    const pathToOpen = join(DOBBY_TEMPLATES_FOLDER, args.name || '');

    if (!existsSync(pathToOpen))
      throw new CustomError(`The template with name "${args.name}" was not found at "${DOBBY_TEMPLATES_FOLDER}"`);

    await openFolder(pathToOpen);
  }
}
