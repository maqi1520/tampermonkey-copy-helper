import React from "react";
import { render } from "react-dom";
import { ReactMediaRecorder } from "react-media-recorder";
import "./record.css";

const RecordView = () => (
  <div className="record-conainer">
    <ReactMediaRecorder
      audio
      mediaRecorderOptions={{
        mimeType: "audio/mpeg3",
        video: false,
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 44100,
        },
      }}
      render={({
        status,
        startRecording,
        stopRecording,
        mediaBlobUrl,
        clearBlobUrl,
      }) => (
        <div>
          <audio src={mediaBlobUrl} controls autoPlay loop />
          <p>状态：{status}</p>
          <div>
            <button className="ui-btn" onClick={startRecording}>
              开始
            </button>
            <button className="ui-btn btn-stop" onClick={stopRecording}>
              停止
            </button>
            <button className="ui-btn btn-clear" onClick={clearBlobUrl}>
              清除录音
            </button>
          </div>
        </div>
      )}
    />
  </div>
);

const div = document.createElement("div");
render(<RecordView />, div);
document.body.appendChild(div);
