const injectMonkeyPatch = function () {
  const s = document.createElement('script');
  s.src = chrome.runtime.getURL('monkeyPatch.js');
  s.onload = function () {
    (this as any).remove();
  };
  (document.head || document.documentElement).appendChild(s);
};

export { injectMonkeyPatch };
