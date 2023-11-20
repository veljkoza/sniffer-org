import { TRequestSentToServiceWorkerPayload } from '../content-script/utils/monkey-patch.types';
import { EventType } from '../event-type/event-type';
import { NetworkSniffer } from '../services/network-sniffer';

const networkSniffer = new NetworkSniffer();
let currentTab: number | null = null;
console.log('Background js!!!');
chrome.action.onClicked.addListener((tab) => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const activeTab = tabs[0];
    const isActiveTab = currentTab === networkSniffer.getActiveTab();
    if (!activeTab.id) return;
    chrome.tabs.sendMessage(activeTab.id, {
      type: EventType.extensionClicked,
      isActiveTab,
      ...networkSniffer.getRepository().getState(),
    });
  });
});

// on change tab listener
chrome.tabs.onActivated.addListener((activeInfo) => {
  const tabId = activeInfo.tabId;
  // const windowId = activeInfo.windowId;
  currentTab = tabId;
  const isActiveTab = tabId === networkSniffer.getActiveTab();

  if (!isActiveTab) {
    networkSniffer.removeEventListeners();
    return;
  }
  if (isActiveTab) {
    console.log('dodo sam');
    networkSniffer.addEventListeners();
  }
  // Do something with the tabId or windowId
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log({ message });
  if (message.type === EventType.startRecording) {
    console.log('starting recording');
    // screenRecorder.start();
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const activeTab = tabs[0];
      if (!activeTab.id) return;
      networkSniffer.start(activeTab.id);
      chrome.tabs.sendMessage(activeTab.id, {
        type: EventType.recordingStarted,
        ...networkSniffer.getRepository().getState(),
      });
    });
  }
  if (message.type === EventType.stopRecording) {
    console.log('stop recording');
    networkSniffer.stop();
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const activeTab = tabs[0];
      console.log({
        state: networkSniffer.getRepository().getState(),
      });
      if (!activeTab.id) return;
      chrome.tabs.sendMessage(activeTab.id, {
        type: EventType.recordingCompleted,
        requestsArray: networkSniffer.getRepository().getRequestsArray(),
      });
    });
  }
  if (message.type === EventType.requestSentToServiceWorker) {
    const payload: TRequestSentToServiceWorkerPayload = message.payload;
    const request = findRequest(payload);

    networkSniffer
      .getRepository()
      .updateRequestResponse(request.requestId, JSON.parse(payload.response));
  }
});

const findRequest = (payload: TRequestSentToServiceWorkerPayload) => {
  const requests = networkSniffer.getRepository().getRequestsArray();
  const index = requests.findIndex((req) => {
    const areTimestampsEqual = areDatesEqualIgnoringMillis(
      new Date(req.timeStamp).toISOString(),
      payload.startTime
    );

    const isPayloadEqual = JSON.stringify(req.requestBody) === payload.payload;
    const isStatusEqual = req.statusCode === payload.status;
    const isUrlEqual = req.url === payload.url;

    return areTimestampsEqual && isPayloadEqual && isStatusEqual && isUrlEqual;
  });

  return requests[index];
};

function areDatesEqualIgnoringMillis(
  isoDate1: string,
  isoDate2: string
): boolean {
  // Parse the dates
  const date1 = new Date(isoDate1);
  const date2 = new Date(isoDate2);

  // Compare each component
  return (
    date1.getUTCFullYear() === date2.getUTCFullYear() &&
    date1.getUTCMonth() === date2.getUTCMonth() &&
    date1.getUTCDate() === date2.getUTCDate() &&
    date1.getUTCHours() === date2.getUTCHours() &&
    date1.getUTCMinutes() === date2.getUTCMinutes() &&
    date1.getUTCSeconds() === date2.getUTCSeconds()
  );
}
