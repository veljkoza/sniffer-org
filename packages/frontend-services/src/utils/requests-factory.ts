import { Method, AxiosInstance, AxiosResponse } from 'axios';
import { http as httpService } from '../http';
const createRequestFactory = (baseUrl?: string) => {
  const requestFactory = async <T, P = undefined>({
    http = httpService,
    method = 'get',
    ...params
  }: {
    http?: typeof httpService;
    method?: Lowercase<Method>;
    body?: any;
    url: string;
    queryParams?: P;
  }) => {
    http.post;
    const fn = http[method as keyof AxiosInstance] as <T>(
      url: string,
      data?: any,
      config?: any
    ) => Promise<AxiosResponse<T>>;

    const fullUrl = `${baseUrl || ''}${params.url}`;

    const res = await fn<T>(fullUrl, params.body);

    return res;
  };
  return requestFactory;
};

export { createRequestFactory };
