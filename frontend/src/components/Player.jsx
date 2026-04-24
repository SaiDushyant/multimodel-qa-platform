import { useRef, useEffect } from "react";

function Player({ fileUrl, fileType, activeTimestamp }) {
  const videoRef = useRef(null);

  useEffect(() => {
    if (videoRef.current && activeTimestamp !== null) {
      videoRef.current.currentTime = activeTimestamp;
      videoRef.current.play();
    }
  }, [activeTimestamp]);

  if (!fileUrl) return null;

  return (
    <div className="flex flex-col gap-2 mt-4">
      <video ref={videoRef} controls className="w-full max-w-xl rounded">
        <source src={fileUrl} type={`video/${fileType}`} />
        Your browser does not support video.
      </video>
    </div>
  );
}

export default Player;
