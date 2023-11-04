import { useParams } from 'react-router-dom';
import { useGetRecording } from '../queries';

const VIDEO_URL = 'http://techslides.com/demos/sample-videos/small.mp4';

export const RecordingDetailsPage = () => {
  const params = useParams<{ id: string }>();
  const { data } = useGetRecording(
    { id: params.id! },
    { enabled: !!params.id }
  );

  console.log({ data });
  return (
    <main className="flex flex-col justify-center items-center h-full">
      <div className="w-5/6">
        <video className="w-2/3" src={data?.screenRecording} controls />
      </div>
    </main>
  );
};
