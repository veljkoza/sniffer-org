export class ScreenRecorder {
  stream = [] as any;
  recorder = [] as any;
  chunks = [] as any;
  streamId = "";

  constructor() {}

  capture = async () => {
    this.stream = await navigator.mediaDevices.getUserMedia({
      video: {
        mandatory: {
          chromeMediaSource: "tab",
          chromeMediaSourceId: this.streamId,
        },
      } as any,
      audio: {
        mandatory: {
          chromeMediaSource: "tab",
          chromeMediaSourceId: this.streamId,
        },
      } as any,
    });

    this.recorder = new MediaRecorder(this.stream);
    this.recorder.ondataavailable = (event: any) => {
      if (event.data.size > 0) {
        this.chunks.push(event.data as any);
      }
    };

    this.recorder.onstop = this.saveVideo;
    this.recorder.start();
  };

  stop = (): Promise<{ blob: Blob; base64: string }> => {
    return new Promise((resolve) => {
      console.log("state", this.recorder.state);
      this.recorder.stop();
      this.recorder.onstop = async () => {
        const blob = this.getBlob();
        const base64 = await this.getBase64(blob);
        this.stream.getTracks().forEach((track: any) => track.stop());
        this.stream = [];
        this.recorder = [];
        console.log("stopped capturing");
        this.chunks = [];

        resolve({ blob, base64 });
      };
    });
  };

  pause = () => {
    this.recorder.pause();
  };

  saveVideo = () => {
    const blob = this.getBlob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    document.body.appendChild(a);
    a.style.display = "none";
    a.href = url;
    a.download = "recording.webm";
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  getBlob = () => {
    const blob = new Blob(this.chunks, { type: "video/webm" });
    return blob;
  };

  getBase64 = (blob?: Blob): Promise<string> => {
    return new Promise((resolve, _) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (reader.result) {
          resolve(reader.result as string);
        }
      };
      reader.readAsDataURL(blob || this.getBlob());
    });
  };

  setStreamId = (streamId: string) => (this.streamId = streamId);
  getStreamId = () => this.streamId;
}
