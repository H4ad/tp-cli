import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { TPTemplate } from './definitions';
import CustomError from './oclif/custom-error';
import { DOBBY_TEMPLATE_FILE, DOBBY_TEMPLATES_FOLDER } from './variables';
import { readYamlFile } from './yaml';

export async function findTPTemplateByName(name: string): Promise<TPTemplate> {
  const filePath = join(DOBBY_TEMPLATES_FOLDER, name, DOBBY_TEMPLATE_FILE);

  try {
    return await readYamlFile<unknown>(filePath).then(template => TPTemplate.parse(template));
  } catch (error: any) {
    throw new CustomError(`Could not load the template "${name}" at "${filePath}". More details: ${error.message}`, {
      code: 'TEMPLATE_NOT_FOUND',
      suggestions: ['Run "tp ls" and get the correct name.'],
    });
  }
}

export async function findTPTemplateContentByName(name: string): Promise<string> {
  const filePath = join(DOBBY_TEMPLATES_FOLDER, name, DOBBY_TEMPLATE_FILE);

  try {
    return await readFile(filePath, { encoding: 'utf8' });
  } catch (error: any) {
    throw new CustomError(`Could not load the template "${name}" at "${filePath}". More details: ${error.message}`, {
      code: 'TEMPLATE_NOT_FOUND',
      suggestions: ['Run "tp ls" and get the correct name.'],
    });
  }
}
