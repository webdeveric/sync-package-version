import path from 'node:path';
import { readFile } from 'node:fs/promises';

import { uniqueItems } from '@webdeveric/utils/uniqueItems';

export function getAbsolutePaths(files: string[], cwd: string): string[] {
  return uniqueItems(
    files.map(file =>
      path.isAbsolute(file) ? file : path.resolve(cwd, file),
    ),
  );
}

export function getJsonIndentation(contents: string): number | string {
  const matches = contents.match(/(?<=[{[]\n+)(?<spaces>[ \t]+)/);

  if (matches) {
    const spaces = matches.groups?.spaces ?? '';

    return /[ ]+/.test(spaces) ? spaces.length : spaces;
  }

  return 0;
}

export function getTrailingWhitespace(contents: string): string {
  const matches = contents.match(/\s+$/s);

  return matches ? matches[ 0 ] : '';
}

export type JsonFileDetails<T = ReturnType<JSON['parse']>> = {
  space: NonNullable<Parameters<JSON['stringify']>[2]>;
  trailingWhitespace: string;
  data: T;
};

export async function readJson(file: string): Promise<JsonFileDetails> {
  const contents = await readFile(file, { encoding: 'utf8' });

  return {
    space: getJsonIndentation(contents),
    trailingWhitespace: getTrailingWhitespace(contents),
    data: JSON.parse(contents),
  };
}
