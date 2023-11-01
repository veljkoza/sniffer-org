export type MethodType<T extends (params: any) => any> = (
  params: Parameters<T>[0]
) => ReturnType<T>;
