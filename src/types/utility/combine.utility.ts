export type CombineTypes<
  I extends Record<string, any>,
  T extends Partial<Record<keyof I, boolean>>
> = {
  [K in keyof I]: T[K] extends true ? I[K] : never;
};
