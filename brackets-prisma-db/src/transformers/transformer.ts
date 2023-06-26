export type Transformer<
  ToInput,
  ToOutput,
  FromInput = ToOutput,
  FromOutput = ToInput,
> = {
  to(input: ToInput): ToOutput;
  from(output: FromInput): FromOutput;
};
