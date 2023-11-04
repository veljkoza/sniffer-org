import {
  QueryKey,
  QueryOptions,
  UseQueryOptions,
  useQuery,
} from '@tanstack/react-query';
import { RecordingModels } from '@sniffer/domain';
import { frontendServices } from '../../frontend-services';

// const useGetRecording = (
//   fnParams: RecordingModels.GetRecording.IRequestDTO,
//   queryOptions?: QueryOptions<RecordingModels.GetRecording.IResponseDTO>
// ) =>
//   useQuery({
//     ...queryOptions,
//     queryKey: ['recording', fnParams.id],
//     queryFn: () => frontendServices.recording.getRecording(fnParams),
//   });

type TQueryFn<TParams, TResponse> = (params: TParams) => Promise<TResponse>;

const queryFactory = <TParams, TResponse>(params: {
  fn: TQueryFn<TParams, TResponse>;
  keyExtractor: (params: TParams) => QueryKey;
}) => {
  return (
    fnParams: TParams,
    queryOptions?: Omit<UseQueryOptions<TResponse>, 'queryKey' | 'queryFn'>
  ) =>
    useQuery({
      ...queryOptions,
      queryKey: params.keyExtractor(fnParams),
      queryFn: () => params.fn(fnParams),
    });
};

const useGetRecording = queryFactory({
  fn: frontendServices.recording.getRecording,
  keyExtractor: ({ id }) => ['recording', id],
});

export { useGetRecording };
