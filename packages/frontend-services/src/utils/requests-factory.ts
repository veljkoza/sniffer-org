import { Method, AxiosInstance, AxiosResponse } from 'axios';
import axios from 'axios';

import { http as httpService } from '../http';
const createRequestFactory = (baseUrl?: string) => {
  const httpService = axios.create({
    baseURL: baseUrl,
  });
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

type RequestFactoryType = ReturnType<typeof createRequestFactory>;

export { createRequestFactory, RequestFactoryType };
