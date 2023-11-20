import { useParams } from 'react-router-dom';
import { useGetRecording } from '../queries';
import { useState } from 'react';
import { DeveloperTools } from '../components/developer-tools/DeveloperTools';
import { mapToDeveloperToolsTableData } from '../components/developer-tools/table';

const VIDEO_URL = 'http://techslides.com/demos/sample-videos/small.mp4';

export const RecordingDetailsPage = () => {
  const params = useParams<{ id: string }>();
  const { data, isLoading, error } = useGetRecording(
    { id: params.id! },
    { enabled: !!params.id }
  );

  const [currentTime, setCurrentTime] = useState(0);

  console.log({ data });
  if (isLoading) return <h1>Loading...</h1>;
  if (error) return <h1>{error.message}</h1>;
  if (!data) return <h1>No data...</h1>;

  const filteredNetworkRecording = data.networkRecording.filter((item) => {
    const startsAt = item.startsAt / 1000 || 0;
    console.log({ startsAt });
    return startsAt <= currentTime;
  });
  console.log({ filteredNetworkRecording });

  const mappedData = mapToDeveloperToolsTableData(
    filteredNetworkRecording,
    (item) => ({
      name: new URL(item.url).pathname,
      domain: new URL(item.url).origin,
      status: item.statusCode,
      type: item.type,
      duration: `${item.startsAt / 10000}`,
      payload: item.requestBody,
      requestHeaders: item.requestHeaders,
      responseHeaders: item.responseHeaders,
      response: item.response,
      url: item.url,
      method: item.method,
    })
  );

  return (
    <main className="flex justify-center items-center h-full">
      <div className="w-2/3 h-full">
        <video
          className="h-full"
          src={data?.screenRecording}
          controls
          onTimeUpdate={(e) => {
            setCurrentTime(e.currentTarget.currentTime);
          }}
        />
      </div>
      <div className="w-1/3 ml-auto h-full">
        <DeveloperTools data={mappedData} />
      </div>
    </main>
  );
};
