/// <reference types="chrome" />
/// <reference types="vite-plugin-svgr/client" />

import './styles/css/common.css';
import { useEffect, useState } from 'react';
import { EventType } from '../../event-type/event-type';
import { ScreenRecorder } from '../../services/screen-recorder';
import { RecordingModels } from '@sniffer/domain';
import React from 'react';
import { frontendServices } from '../../services/frontend-services';
const screenRecorder = new ScreenRecorder();

function App() {
  const [uiStatus, setUiStatus] = useState<
    'inactive' | 'open' | 'recording' | 'completed'
  >('inactive');

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
            screenRecorder.capture();
            setUiStatus('recording');
          }
          if (message.type === EventType.recordingCompleted) {
            const res = await screenRecorder.stop();
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
      <div className="container--overlay">
        <div
          style={{ width: '70%', textAlign: 'center' }}
          className="pop-up middle"
        >
          <p className="link">Loading...</p>
        </div>
      </div>
    );
  if (isStatus('inactive')) return <></>;
  if (isStatus('open'))
    return (
      <div className="container--overlay">
        <div className="pop-up top-right">
          <button className="button" onClick={() => start()}>
            Start
          </button>
        </div>
      </div>
    );
  if (isStatus('recording'))
    return (
      <div className="pop-up top-right">
        <button className="button" onClick={() => stop()}>
          Stop
        </button>
      </div>
    );
  if (isStatus('completed'))
    return (
      <div
        style={{ width: '70%', textAlign: 'center' }}
        className="pop-up middle"
      >
        <a href=" " className="link" style={{ fontSize: '1.2rem' }}>
          {data?.url}
        </a>
      </div>
    );

  return (
    <div>
      <div
        style={{ width: '70%', textAlign: 'center' }}
        className="pop-up middle"
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
