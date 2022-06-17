import type { Command } from 'commander';

export type CustomCommand = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  action: (...args: any[]) => Promise<void>;
  register:(program: Command) => Command;
};
