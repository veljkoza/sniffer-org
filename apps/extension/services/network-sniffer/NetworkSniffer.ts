import { NetworkSnifferRepository } from "./NetworkSniffer.repository";

export class NetworkSniffer {
  networkSnifferRepository: NetworkSnifferRepository;
  activeTab: number | null = null;
  constructor(
    activeTab?: number | null,
    networkSnifferRepository = new NetworkSnifferRepository()
  ) {
    this.networkSnifferRepository = networkSnifferRepository;
    this.activeTab = activeTab || null;
  }

  addEventListeners = () => {
    chrome.webRequest.onBeforeRequest.addListener(
      this.networkSnifferRepository.onBeforeRequest,
      { urls: ["<all_urls>"], types: ["main_frame", "xmlhttprequest"] },
      ["requestBody"]
    );

    chrome.webRequest.onSendHeaders.addListener(
      this.networkSnifferRepository.onSendHeaders,
      { urls: ["<all_urls>"], types: ["main_frame", "xmlhttprequest"] },
      ["requestHeaders"]
    );

    chrome.webRequest.onHeadersReceived.addListener(
      this.networkSnifferRepository.onHeadersReceived,
      { urls: ["<all_urls>"], types: ["main_frame", "xmlhttprequest"] },
      ["responseHeaders"]
    );

    chrome.webRequest.onCompleted.addListener(
      this.networkSnifferRepository.onCompleted,
      {
        urls: ["<all_urls>"],
        types: ["main_frame", "xmlhttprequest"],
      }
    );
    chrome.webRequest.onErrorOccurred.addListener(
      this.networkSnifferRepository.onErrorOccurred,
      {
        urls: ["<all_urls>"],
        types: ["main_frame", "xmlhttprequest"],
      }
    );
  };

  removeEventListeners = () => {
    chrome.webRequest.onBeforeRequest.removeListener(
      this.networkSnifferRepository.onBeforeRequest
    );

    chrome.webRequest.onSendHeaders.removeListener(
      this.networkSnifferRepository.onSendHeaders
    );

    chrome.webRequest.onHeadersReceived.removeListener(
      this.networkSnifferRepository.onHeadersReceived
    );

    chrome.webRequest.onCompleted.removeListener(
      this.networkSnifferRepository.onCompleted
    );
    chrome.webRequest.onErrorOccurred.removeListener(
      this.networkSnifferRepository.onErrorOccurred
    );
  };

  start = (activeTab: number | null) => {
    if (!activeTab)
      throw new Error(
        `Not valid tab id to start network sniffing. tabId:${activeTab}`
      );
    this.networkSnifferRepository.startRecording();
    this.addEventListeners();
    this.activeTab = activeTab;
  };

  stop = () => {
    this.networkSnifferRepository.stopRecording();
    this.removeEventListeners();
    this.activeTab = null;
  };

  getRepository = () => this.networkSnifferRepository;

  getActiveTab = () => this.activeTab;
  setActiveTab = (activeTab: number) => (this.activeTab = activeTab);
}
