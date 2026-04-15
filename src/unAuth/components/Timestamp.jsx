import "./Timestamp.css";
import { useMemo, useState, useEffect } from "react";
import { httpsCallable } from "firebase/functions";
import { functions } from "../../firebase";
import LocalHistory from "./LocalHistory";

/** Normalize callable payload for display and clipboard. */
function timestampsCopyText(data) {
  if (!data || typeof data !== "object") return "";
  if (typeof data.timestamps_string === "string" && data.timestamps_string.trim()) {
    return data.timestamps_string.replace(/\n+$/, "");
  }
  if (Array.isArray(data.timestamps_list)) {
    return data.timestamps_list.join("\n");
  }
  return "";
}

const Timestamp = () => {
  const [url, setUrl] = useState("");
  const [touched, setTouched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [apiError, setApiError] = useState("");
  const [videoData, setVideoData] = useState(null);
  const [timestampsPayload, setTimestampsPayload] = useState(null);
  const [copyLabel, setCopyLabel] = useState("Copy");

  const youtubeUrlRegex = useMemo(
    () =>
      /^(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:watch\?v=|shorts\/|embed\/)|youtu\.be\/)([A-Za-z0-9_-]{11})(?:[?&/#][^\s]*)?$/i,
    []
  );

  const isEmpty = url.trim().length === 0;
  const isValid = youtubeUrlRegex.test(url.trim());
  const showError = touched && !isEmpty && !isValid;
  const youtubeApiKey = import.meta.env.VITE_YOUTUBE_API_KEY || "";

  const extractVideoId = (inputUrl) => {
    const match = inputUrl.trim().match(youtubeUrlRegex);
    return match ? match[1] : null;
  };

  const getBestThumbnail = (thumbnails) =>
    thumbnails?.maxres?.url ||
    thumbnails?.standard?.url ||
    thumbnails?.high?.url ||
    thumbnails?.medium?.url ||
    thumbnails?.default?.url ||
    "";

  const handleFetchVideo = async (e) => {
    e.preventDefault();
    setTouched(true);
    setApiError("");

    const videoId = extractVideoId(url);
    if (!videoId) {
      setVideoData(null);
      setTimestampsPayload(null);
      return;
    }

    if (!youtubeApiKey) {
      setVideoData(null);
      setTimestampsPayload(null);
      setApiError("Missing YouTube API key in .env.");
      return;
    }

    try {
      setLoading(true);
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 10000); // 10 second timeout
      const endpoint = `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${videoId}&key=${youtubeApiKey}`;
      const response = await fetch(endpoint, { signal: controller.signal });
      clearTimeout(timeout);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error?.message || "Failed to fetch video details.");
      }

      const snippet = data?.items?.[0]?.snippet;
      if (!snippet) {
        setVideoData(null);
        setTimestampsPayload(null);
        setApiError("No video found for this URL.");
        return;
      }

      setTimestampsPayload(null);
      setVideoData({
        title: snippet.title,
        thumbnail: getBestThumbnail(snippet.thumbnails),
      });
    } catch (error) {
      setVideoData(null);
      setTimestampsPayload(null);
      setApiError(error.message || "Could not load video details.");
    } finally {
      setLoading(false);
    }
  };

  // Reset copy button label after 2 seconds
  useEffect(() => {
    if (copyLabel !== "Copy") {
      const timer = setTimeout(() => setCopyLabel("Copy"), 2000);
      return () => clearTimeout(timer);
    }
  }, [copyLabel]);

  const handleGenerateTimestamps = async () => {
    setApiError("");
    if (!videoData || !isValid) {
      setApiError("Load a valid video preview first.");
      return;
    }
  
    try {
      setGenerating(true);
      const generateTimestamps = httpsCallable(functions, "generate_timestamps");
      const result = await generateTimestamps({ url: url.trim() });
      const payload = result.data ?? null;
  
      if (payload) {
        setTimestampsPayload(payload);
  
        // --- NEW: Save to localStorage ---
        const historyItem = {
          id: extractVideoId(url),
          url: url.trim(),
          title: videoData.title,
          thumbnail: videoData.thumbnail,
          payload: payload,
          timestamp: new Date().toISOString(),
        };
  
        const existingHistory = JSON.parse(localStorage.getItem("yt_history") || "[]");
        
        // Prevent duplicates: Remove old entry for this video if it exists
        const filteredHistory = existingHistory.filter(item => item.id !== historyItem.id);
        
        // Add new item to the start of the array
        const newHistory = [historyItem, ...filteredHistory].slice(0, 10); // Keep last 10
        localStorage.setItem("yt_history", JSON.stringify(newHistory));
        // ---------------------------------
      }
    } catch (error) {
      setApiError(error?.message || "Failed to generate timestamps.");
    } finally {
      setGenerating(false);
    }
  };

  const handleCopyTimestamps = async () => {
    const text = timestampsCopyText(timestampsPayload);
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      setCopyLabel("Copied!");
    } catch {
      setCopyLabel("Copy failed");
    }
  };

  const handleSelectFromHistory = (item) => {
    setUrl(item.url);
    setVideoData({ title: item.title, thumbnail: item.thumbnail });
    setTimestampsPayload(item.payload);
    // Smooth scroll back to top if needed
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const timestampLines = Array.isArray(timestampsPayload?.timestamps_list)
    ? timestampsPayload.timestamps_list
    : [];

  return (
    <section className="timestamp" id="how-it-works">
      <h2>YouTube Video Preview</h2>
      <p>Paste a YouTube URL to load the thumbnail and title.</p>

      <form className="timestamp__form" onSubmit={handleFetchVideo}>
        <label className="timestamp__label" htmlFor="youtube-url">
          YouTube URL
        </label>
        <div className="timestamp__input-row">
          <input
            id="youtube-url"
            name="youtubeUrl"
            className={`timestamp__input${showError ? " timestamp__input--error" : ""}${
              touched && !isEmpty && isValid ? " timestamp__input--valid" : ""
            }`}
            type="url"
            inputMode="url"
            autoComplete="off"
            placeholder="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onBlur={() => setTouched(true)}
            aria-invalid={showError ? "true" : "false"}
            aria-describedby={
              showError || apiError ? "youtube-url-feedback" : undefined
            }
            required
          />
          <button className="timestamp__button" type="submit" disabled={!isValid || loading}>
            {loading ? "Loading..." : "Get Preview"}
          </button>
        </div>
        {(showError || apiError) && (
          <div className="timestamp__error" id="youtube-url-feedback" role="alert">
            {showError ? "Please enter a valid YouTube URL." : apiError}
          </div>
        )}
      </form>

      {videoData && (
        <article className="timestamp__preview" aria-live="polite">
          {videoData.thumbnail ? (
            <img
              className="timestamp__thumbnail"
              src={videoData.thumbnail}
              alt={videoData.title}
              loading="lazy"
            />
          ) : null}
          <h3 className="timestamp__video-title">{videoData.title}</h3>
          <button
            className="timestamp__button"
            type="button"
            onClick={handleGenerateTimestamps}
            disabled={generating}
          >
            {generating ? "Generating..." : "Generate Timestamps"}
          </button>

          {timestampsPayload && (
            <div className="timestamp__result">
              <div className="timestamp__result-toolbar">
                <h4 className="timestamp__result-heading">Timestamps</h4>
                <button
                  type="button"
                  className="timestamp__button timestamp__button--copy"
                  onClick={handleCopyTimestamps}
                  disabled={!timestampsCopyText(timestampsPayload)}
                >
                  {copyLabel}
                </button>
              </div>
              {timestampsPayload.video_duration != null && (
                <p className="timestamp__meta">
                  Video duration: {String(timestampsPayload.video_duration)}
                </p>
              )}
              {timestampLines.length > 0 ? (
                <ol className="timestamp__list">
                  {timestampLines.map((line, index) => (
                    <li key={`${index}-${line.slice(0, 24)}`} className="timestamp__list-item">
                      {line}
                    </li>
                  ))}
                </ol>
              ) : (
                <pre className="timestamp__pre">{timestampsCopyText(timestampsPayload)}</pre>
              )}
            </div>
          )}
        </article>
      )}
      <LocalHistory onSelectVideo={handleSelectFromHistory} />
    </section>
  );
};

export default Timestamp;
