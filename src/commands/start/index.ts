import { Args, Command, Flags } from '@oclif/core';
import { paramCase } from 'change-case';
import yaml from 'js-yaml';
import { existsSync } from 'node:fs';
import { mkdir, rm, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { TPTemplate } from '../../utils/definitions';
import CustomCommand from '../../utils/oclif/custom-command';
import CustomError from '../../utils/oclif/custom-error';
import { TP_TEMPLATE_FILE, TP_TEMPLATES_FOLDER } from '../../utils/variables';

export default class Start extends CustomCommand {
  static description = 'Start a new template.'

  static examples = [
    '$ tp start my-api',
  ]

  static flags = {
    force: Flags.boolean({ description: 'If the template already exist, it removes and start a new one.', aliases: ['f'], default: false }),
  }

  static args = {
    name: Args.string({ description: 'Name of the template', required: true }),
  }

  async run(): Promise<void> {
    const { args, flags } = await this.parse(Start);

    await Start.create(this.log.bind(this), args.name, undefined, flags.force);
  }

  public static async create(log: Command['log'], name: string, template?: string, force?: boolean): Promise<void> {
    const tpFileContent = template ?? this.getDefaultTemplate();
    const isValidTemplate = TPTemplate.safeParse(yaml.load(tpFileContent));

    if (!isValidTemplate.success)
      throw new CustomError(`The template file that you want to install is not valid. See more: ${isValidTemplate.error.message}`);

    const templateName = paramCase(name);

    const outputFolder = join(TP_TEMPLATES_FOLDER, templateName);
    const outputFile = join(outputFolder, TP_TEMPLATE_FILE);

    const alreadyExist = existsSync(outputFile);

    if (alreadyExist) {
      if (!force) {
        throw new CustomError(`A template already exists in ${templateName} with the same name.`, {
          code: 'TEMPLATE_ALREADY_EXIST',
          suggestions: ['Run "tp list" to see all templates.'],
        });
      }

      await rm(outputFolder, {
        recursive: true,
        force: true,
      });
    }

    log(`Creating template folder at: ${outputFolder}`);
    await mkdir(outputFolder, {
      recursive: true,
    });

    log(`Creating tp template file at: ${outputFile}`);
    await writeFile(outputFile, tpFileContent, { encoding: 'utf8' });

    log(`Done! Now, use "tp list" to see your template. To edit your template, run "tp open ${templateName}".`);
  }

  private static getDefaultTemplate(): string {
    // language=YAML
    return `# the description that will be shown during "tp list"
description: "My simple template"

# Where we can get this template
# installUrl: https://gist.github.com/blablabla

# commands that will be read by tp
generate:
  # name of your resource
  # this will be exposed like: tp generate setup <name>
  setup:
    description: "Initialize the API with some files"
    structure:
      # inside your resource, you can specificy which files will be created
      # it will be relative to the CLI, and you can specificy sub-folders by just putting folder/file
      src/$PARAM_SINGULAR_NAME$.api.js:
        content: |-
          const express = require('express');
          const router = express.Router();

          router.get('/$NAME$', (req, res) => res.json(JSON.parse({ hello: 'World' })));

          module.exports = router;
      src/index.js:
        content: |-
          const $CAMEL_SINGULAR_NAME$ = require('./$PARAM_SINGULAR_NAME$.api');
          const express = require('express');
          const app = express();

          app.use('/$NAME$', $CAMEL_SINGULAR_NAME$);

          app.listen(3000);
      README.md:
        content: |-
          # Simple API

          This is an example of how this could work.

          ## Docs

          To customize the file content during generation, you can use the above variables:

          - \`NAME\`: $NAME$
          - \`PASCAL_SINGULAR_NAME\`: $PASCAL_SINGULAR_NAME$
          - \`PARAM_SINGULAR_NAME\`: $PARAM_SINGULAR_NAME$
          - \`CAMEL_SINGULAR_NAME\`: $CAMEL_SINGULAR_NAME$
          - \`PASCAL_PLURAL_NAME\`: $PASCAL_PLURAL_NAME$
          - \`CAMEL_PLURAL_NAME\`: $CAMEL_PLURAL_NAME$
          - \`PARAM_PLURAL_NAME\`: $PARAM_PLURAL_NAME$
          - \`PASCAL_NAME\`: $PASCAL_NAME$
          - \`PARAM_NAME\`: $PARAM_NAME$
          - \`CAMEL_NAME\`: $CAMEL_NAME$

          To work, you should put the name wrapped by \`$\`, like: \`$TEST$\`
`;
  }
}
