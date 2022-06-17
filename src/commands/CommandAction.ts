export abstract class CommandAction {
  abstract run(...args: unknown[]): Promise<unknown>;
}
