// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
const events = {
  requestDetectedInHostPage: 'request-detected-in-host-page',
};
const sendMessageToContentScript = ({ event, payload }) => {
  document.dispatchEvent(
    new CustomEvent(event, {
      detail: payload,
    })
  );
};

(function () {
  console.log('LOADED XHR MONKEY PATCH');
  const oldOpen = XMLHttpRequest.prototype.open;
  const oldSend = XMLHttpRequest.prototype.send;

  XMLHttpRequest.prototype.open = function (method, url, async, user, pass) {
    this._method = method;
    this._url = url;
    this._startTime = new Date();
    console.log({ startTime: this._startTime });
    oldOpen.call(this, method, url, async, user, pass);
  };

  XMLHttpRequest.prototype.send = function (body) {
    const startTime = this._startTime;

    this.addEventListener('load', function () {
      const duration = new Date() - startTime;
      console.log({ this: this });
      console.log('XHR Request URL:', this._url);
      console.log('XHR Method:', this._method);
      console.log('XHR Request Body:', body);
      console.log('XHR Response Status:', this.status);
      console.log('XHR Response:', this.responseText);
      const payload = {
        response: this.response,
        status: this.status,
        url: this._url,
        startTime: startTime.toISOString(),
        payload: body,
      };
      console.log({ payload });
      // eslint-disable-next-line no-undef
      sendMessageToContentScript({
        event: events.requestDetectedInHostPage,
        payload,
      });

      console.log('XHR Duration:', duration, 'ms');
      // Removed the logging of request headers
      console.log('XHR Response Headers:', this.getAllResponseHeaders());
    });

    oldSend.call(this, body);
  };
})();

(function () {
  console.log('LOADED FETCH MONKEY PATCH');

  const originalFetch = window.fetch;

  window.fetch = async function (...args) {
    const startTime = new Date();
    const url = args[0];
    const init = args[1] || {};
    console.log({ startTime });
    console.log('Fetch Request URL:', url);
    console.log('Fetch Method:', init.method || 'GET');
    if (init.headers) {
      console.log('Fetch Request Headers:', Object.fromEntries(init.headers));
    }
    console.log('Fetch Payload:', init.body);

    try {
      const response = await originalFetch(...args);
      const duration = new Date() - startTime;
      const responseClone = response.clone();

      console.log('Fetch Response Status:', response.status);
      console.log(
        'Fetch Response Headers:',
        Object.fromEntries(response.headers)
      );
      console.log('Fetch Duration:', duration, 'ms');

      responseClone
        .json()
        .then((data) => {
          console.log('Fetch Response:', data);
          const payload = {
            payload: init.body,
            response: JSON.stringify(data),
            startTime: startTime.toISOString(),
            status: response.status,
            url,
          };
          console.log({ payloadFetch: payload });
          sendMessageToContentScript({
            event: events.requestDetectedInHostPage,
            payload,
          });
        })
        .catch(() => {
          responseClone.text().then((text) => {
            console.log('Fetch Response:', text);
          });
        });

      return response;
    } catch (error) {
      console.error('Fetch Error:', error);
      throw error;
    }
  };
})();
