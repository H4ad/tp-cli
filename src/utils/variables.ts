import { homedir } from 'node:os';
import { join } from 'node:path';

export const DOBBY_CONFIG_FILE = '.tp.yml';
export const DOBBY_TEMPLATE_FILE = 'tp.yml';
export const DOBBY_FOLDER = join(homedir(), '.tp');
export const DOBBY_TEMPLATES_FOLDER = join(DOBBY_FOLDER, 'templates');
