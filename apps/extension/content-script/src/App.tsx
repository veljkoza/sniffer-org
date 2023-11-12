/// <reference types="chrome" />
/// <reference types="vite-plugin-svgr/client" />

// Styles
import './styles/css/index.css';
import { useEffect, useState } from 'react';
import { EventType } from '../../event-type/event-type';
import { ScreenRecorder } from '../../services/screen-recorder';
import { RecordingModels } from '@sniffer/domain';
import { frontendServices } from '../../services/frontend-services';
import { useTimer } from '../../shared/hooks';
import { Icons } from '../../shared/icons';
import { Toolbar } from './components';
const screenRecorder = new ScreenRecorder();

function App() {
  const [uiStatus, setUiStatus] = useState<
    'inactive' | 'open' | 'recording' | 'completed'
  >('inactive');

  const timer = useTimer();

  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<{ url: string }>();
  useEffect(() => {
    const init = async () => {
      chrome.runtime.onMessage.addListener(
        async (message, sender, sendResponse) => {
          console.log({ message });
          if (message.type === EventType.streamIdSent) {
            setUiStatus('open');
            screenRecorder.setStreamId(message.streamId);
          }
          if (message.type === EventType.recordingStarted) {
            timer.start();
            screenRecorder.capture();
            setUiStatus('recording');
          }
          if (message.type === EventType.recordingCompleted) {
            const res = await screenRecorder.stop();
            timer.stop();
            // const base64 = await screenRecorder.getBase64();
            const payload: RecordingModels.CreateRecording.IRequestDTO = {
              networkRecording: message.requestsArray,
              screenRecording: res.base64,
            };
            setIsLoading(true);
            frontendServices.recording
              .generateUrl(payload)
              .then((res) => {
                setData(res);
              })
              .finally(() => {
                setUiStatus('completed');
                setIsLoading(false);
              });
            console.log({ payload });
          }
        }
      );
    };

    init();
  }, []);

  const isStatus = (status: typeof uiStatus) => uiStatus === status;
  const start = () =>
    chrome.runtime.sendMessage({ type: EventType.startRecording });
  const stop = () =>
    chrome.runtime.sendMessage({ type: EventType.stopRecording });

  if (isLoading)
    return (
      <div className="text-center fixed inset-0 h-full w-full z-[9999]">
        <div
          style={{ width: '70%', textAlign: 'center' }}
          className="fixed bg-primary bg-opacity-40 p-12 rounded-2xl top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
        >
          <p className="link">Loading...</p>
        </div>
      </div>
    );
  if (isStatus('inactive')) return <></>;
  if (isStatus('open'))
    return (
      <div className="text-center fixed inset-0 h-full w-full z-[9999]">
        <div className="fixed bg-orange-200 p-12 rounded-2xl top-4 right-4">
          <button
            className="px-12 py-6 bg-primary text-white rounded-lg"
            onClick={() => start()}
          >
            Start
          </button>
        </div>
      </div>
    );
  if (isStatus('recording'))
    return (
      <Toolbar>
        <p>{timer.formattedTime}</p>
        <button onClick={() => stop()}>
          <Icons.Stop className="h-8 w-8 text-primary" />
        </button>
      </Toolbar>
      // <div className="pop-up top-right">
      //   <button className="button" onClick={() => stop()}>
      //     Stop
      //   </button>
      // </div>
    );
  if (isStatus('completed'))
    return (
      <div
        style={{ width: '70%', textAlign: 'center' }}
        className="fixed bg-orange-200 p-12 rounded-2xl top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
      >
        <a href={data?.url} target="_blank" className="text-primary text-lg">
          {data?.url}
        </a>
      </div>
    );

  return (
    <div>
      <div
        style={{ width: '70%', textAlign: 'center' }}
        className="fixed bg-orange-200 p-12 rounded-2xl top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
      >
        <a href=" " className="link" style={{ fontSize: '1.2rem' }}>
          Already active
        </a>
      </div>
    </div>
  );
}

const downloadObjectAsJson = (exportObj: any, exportName = 'requests') => {
  const dataStr =
    'data:text/json;charset=utf-8,' +
    encodeURIComponent(JSON.stringify(exportObj, null, 4));
  const downloadAnchorNode = document.createElement('a');
  downloadAnchorNode.setAttribute('href', dataStr);
  downloadAnchorNode.setAttribute('download', exportName + '.json');
  document.body.appendChild(downloadAnchorNode); // required for firefox
  downloadAnchorNode.click();
  downloadAnchorNode.remove();
};

export default App;
