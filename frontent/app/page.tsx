"use client";
import { useState } from "react";
import { useSpeechSynthesis } from "react-speech-kit";

export default function TextToSpeech() {
  const [text, setText] = useState("");
  const [message, setMessage] = useState("");
  const { speak, speaking, cancel, supported, voices } = useSpeechSynthesis();

  const handleSpeak = () => {
    if (!text.trim()) {
      setMessage("Please enter some text.");
      return;
    }
    setMessage("");
    speak({ text });
  };

  const handleStop = () => {
    cancel();
    setMessage("Speech stopped.");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-600 px-4">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl p-8 flex flex-col items-center">
        <h1 className="text-4xl font-bold text-indigo-700 mb-6">Text to Speech Converter</h1>
        {!supported ? (
          <p className="text-red-600 font-semibold">Sorry, your browser does not support Speech Synthesis.</p>
        ) : (
          <>
            <textarea
              className="w-full h-32 px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none mb-4 resize-none"
              placeholder="Enter text to convert to speech..."
              value={text}
              onChange={e => setText(e.target.value)}
            />
            <div className="flex gap-4 w-full">
              <button
                onClick={handleSpeak}
                disabled={speaking}
                className={`flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-2 rounded-lg transition duration-200 ${
                  speaking ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {speaking ? "Speaking..." : "Convert"}
              </button>
              {speaking && (
                <button
                  onClick={handleStop}
                  className="flex-1 bg-red-500 hover:bg-red-600 text-white font-semibold px-6 py-2 rounded-lg transition duration-200"
                >
                  Stop
                </button>
              )}
            </div>
            {message && (
              <p className="mt-4 text-indigo-700 font-medium">{message}</p>
            )}
          </>
        )}
      </div>
    </div>
  );
}