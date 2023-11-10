import { useParams } from 'react-router-dom';
import { useGetRecording } from '../queries';
import { useState } from 'react';

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

  const mappedData = mapToTableData(filteredNetworkRecording, (item) => ({
    id: item.requestId,
    initiator: item.initiator,
    status: item.statusCode,
    type: item.type,
    size: '200',
    time: `${item.startsAt / 10000}`,
  }));

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

const DeveloperTools = ({ data }: { data: typeof tableData }) => {
  return (
    <div className="h-full">
      <Table data={data} />
    </div>
  );
};

const mapToTableData = <T,>(
  data: T[],
  cb: (item: T) => (typeof tableData)['0']
) => {
  return data.map(cb);
};

const tableData = [
  {
    id: '649119c8-3105-40',
    status: 200,
    type: 'xhr',
    initiator: 'requests...',
    size: '245 B',
    time: '143...',
  },
  {
    id: '649119c8-3105-40',
    status: 200,
    type: 'xhr',
    initiator: 'requests...',
    size: '245 B',
    time: '143...',
  },
  // ... Add other data rows as needed
];

const Table = ({ data }: { data: typeof tableData }) => {
  return (
    <div className="overflow-x-auto bg-developerTools-table-background h-full font-sans font-light text-left">
      <table className="min-w-full bg-white">
        <thead className="bg-developerTools-table-headerBg border-developerTools-table-border text-white text-sm">
          <tr>
            <th className="px-4 py-2 border border-developerTools-table-border font-light font-sans ">
              Name
            </th>
            <th className="px-4 py-2  border-developerTools-table-border border font-light font-sans">
              Status
            </th>
            <th className="px-4 py-2  border-developerTools-table-border border font-light font-sans">
              Type
            </th>
            <th className="px-4 py-2  border-developerTools-table-border border font-light font-sans">
              Initiator
            </th>
            <th className="px-4 py-2  border-developerTools-table-border border font-light font-sans">
              Size
            </th>
            <th className="px-4 py-2  border-developerTools-table-border border font-light font-sans">
              Time
            </th>
          </tr>
        </thead>
        <tbody className="text-white text-xs">
          {data.map((row, index) => (
            <tr
              key={index}
              className={` ${
                (index + 1) % 2 === 0
                  ? 'bg-developerTools-table-rowEvenBg'
                  : 'bg-developerTools-table-rowOddBg'
              }`}
            >
              <td className=" px-4 py-2 border-l border-developerTools-table-border border-r ">
                {row.id}
              </td>
              <td className="border-l border-developerTools-table-border border-r  px-4 py-2">
                {row.status}
              </td>
              <td className="border-l border-developerTools-table-border border-r  px-4 py-2">
                {row.type}
              </td>
              <td className="border-l border-developerTools-table-border border-r  px-4 py-2">
                {row.initiator}
              </td>
              <td className="border-l border-developerTools-table-border border-r  px-4 py-2">
                {row.size}
              </td>
              <td className="border-l border-developerTools-table-border border-r  px-4 py-2">
                {row.time}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
