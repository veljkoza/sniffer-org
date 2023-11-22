/// <reference types="chrome" />
/// <reference types="vite-plugin-svgr/client" />

import Logo from './Logo';
import './App.css';
import { EventType } from '../event-type/event-type';
chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
  const tabId = tabs[0].id;
  chrome.tabCapture.getMediaStreamId(
    { consumerTabId: tabId },
    function (streamId) {
      const message = {
        type: EventType.streamIdSent,
        streamId: streamId,
        tabId,
      };
      console.log('POPUP!!');
      if (tabId) chrome.tabs.sendMessage(tabId, message);
      window.close();
    }
  );
});
function App() {
  return (
    <div></div>
    // <div className="App">
    //   <header className="App-header">
    //     <Logo className="App-logo" id="App-logo" title="React logo" />
    //     <p>Hello, World!</p>
    //     <p>I'm a Chrome Extension Popup!</p>
    //   </header>
    // </div>
  );
}

export default App;
