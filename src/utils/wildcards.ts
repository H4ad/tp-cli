import { camelCase, capitalCase, constantCase, dotCase, headerCase, noCase, paramCase, pascalCase, pathCase, snakeCase } from 'change-case';
import { plural, singular } from 'pluralize';

const caseSingular = (caseFn: (text: string) => string) => (text: string) => caseFn(noCase(text).split(' ').map(part => singular(part)).join(' '));
const casePlural = (caseFn: (text: string) => string) => (text: string) => caseFn(noCase(text).split(' ').map(part => plural(part)).join(' '));

export const WILDCARDS = {
  $NAME$: value => value,

  $PASCAL_SINGULAR_NAME$: caseSingular(pascalCase),
  $PARAM_SINGULAR_NAME$: caseSingular(paramCase),
  $CAMEL_SINGULAR_NAME$: caseSingular(camelCase),
  $CAPITAL_SINGULAR_NAME$: caseSingular(capitalCase),
  $CONSTANT_SINGULAR_NAME$: caseSingular(constantCase),
  $HEADER_SINGULAR_NAME$: caseSingular(headerCase),
  $DOT_SINGULAR_NAME$: caseSingular(dotCase),
  $PATH_SINGULAR_NAME$: caseSingular(pathCase),
  $SNAKE_SINGULAR_NAME$: caseSingular(snakeCase),

  $PASCAL_PLURAL_NAME$: casePlural(pascalCase),
  $CAMEL_PLURAL_NAME$: casePlural(camelCase),
  $PARAM_PLURAL_NAME$: casePlural(paramCase),
  $CAPITAL_PLURAL_NAME$: casePlural(capitalCase),
  $CONSTANT_PLURAL_NAME$: casePlural(constantCase),
  $HEADER_PLURAL_NAME$: casePlural(headerCase),
  $DOT_PLURAL_NAME$: casePlural(dotCase),
  $PATH_PLURAL_NAME$: casePlural(pathCase),
  $SNAKE_PLURAL_NAME$: casePlural(snakeCase),

  $PASCAL_NAME$: value => pascalCase(value),
  $PARAM_NAME$: value => paramCase(value),
  $CAMEL_NAME$: value => camelCase(value),
  $CAPITAL_NAME$: value => capitalCase(value),
  $CONSTANT_NAME$: value => constantCase(value),
  $HEADER_NAME$: value => headerCase(value),
  $DOT_NAME$: value => dotCase(value),
  $PATH_NAME$: value => pathCase(value),
  $SNAKE_NAME$: value => snakeCase(value),
} as const satisfies Record<string, (value: string) => string>;

function escapeRegExp(string: string): string {
  return string.replace(/[$()*+.?[\\\]^{|}]/g, '\\$&'); // $& means the whole matched string
}

const wildcardNames = Object.keys(WILDCARDS) as Array<keyof typeof WILDCARDS>;

export function replaceTextWithWildcards(content: string, text: string): string {
  for (const wildcard of wildcardNames) {
    const transformFn = WILDCARDS[wildcard];

    content = content.replace(new RegExp(escapeRegExp(wildcard), 'g'), transformFn(text));
  }

  return content;
}
