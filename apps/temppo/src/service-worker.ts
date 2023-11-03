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
    // screenRecorder.stop();
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
});
