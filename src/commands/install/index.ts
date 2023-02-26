import { Args, Flags } from '@oclif/core';
import axios from 'axios';
import yaml from 'js-yaml';
import { TPTemplate } from '../../utils/definitions';
import CustomCommand from '../../utils/oclif/custom-command';
import CustomError from '../../utils/oclif/custom-error';
import Start from '../start';

export default class Install extends CustomCommand {
  static description = 'Install a tp template from an URL.';

  static examples = [
    '$ tp install <name> <url>',
  ];

  static flags = {
    force: Flags.boolean({ description: 'If the template already installed, override the current installation.', default: false }),
  };

  static args = {
    name: Args.string({ description: 'Specify the template name that will be installed.', required: true }),
    url: Args.url({ description: 'Specify the URL where the template are hosted.', required: true }),
  };

  async run(): Promise<void> {
    const { args, flags } = await this.parse(Install);

    const tpStringTemplate = await axios.get<string>(args.url.toString(), { responseType: 'text' })
    .then(res => res.data);

    const isValidYml = TPTemplate.safeParse(yaml.load(tpStringTemplate));

    if (!isValidYml.success)
      throw new CustomError(`The template file that you want to install is not valid. See more: ${isValidYml.error.message}`);

    await Start.create(this.log.bind(this), args.name, tpStringTemplate, flags.force);
  }
}
