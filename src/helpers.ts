import { readFile } from 'node:fs/promises';

export function getJsonIndentation(contents: string): number | string {
  const spaces = contents.match(/(?<=[{[]\n+)(?<spaces>[ \t]+)/)?.groups?.spaces ?? '';

  return spaces === '' ? 0 : /[ ]+/.test(spaces) ? spaces.length : spaces;
}

export function getTrailingWhitespace(contents: string): string {
  return contents.match(/(?<whiteSpace>\s+)$/s)?.groups?.whiteSpace ?? '';
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
