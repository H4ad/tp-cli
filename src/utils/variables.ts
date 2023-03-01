import { homedir } from 'node:os';
import { join } from 'node:path';

export const TP_CONFIG_FILE = '.tp.yml';
export const TP_TEMPLATE_FILE = 'tp.yml';
export const TP_FOLDER = join(homedir(), '.tp');
export const TP_TEMPLATES_FOLDER = join(TP_FOLDER, 'templates');
