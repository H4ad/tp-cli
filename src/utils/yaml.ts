import yaml from 'js-yaml';
import { readFile, writeFile } from 'node:fs/promises';

export function readYamlFile<T>(path: string): Promise<T> {
  return readFile(path, { encoding: 'utf-8' }).then(file => yaml.load(file) as T);
}

export function writeYamlFile<T>(path: string, obj: T): Promise<void> {
  return writeFile(path, yaml.dump(obj));
}
