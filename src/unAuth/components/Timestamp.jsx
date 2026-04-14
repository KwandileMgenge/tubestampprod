import "./Timestamp.css";
import { useMemo, useState } from "react";

const Timestamp = () => {
  const [url, setUrl] = useState("");
  const [touched, setTouched] = useState(false);

  const youtubeUrlRegex = useMemo(
    () =>
      /^(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:watch\?v=|shorts\/|embed\/)|youtu\.be\/)([A-Za-z0-9_-]{11})(?:[?&/#][^\s]*)?$/i,
    []
  );

  const isEmpty = url.trim().length === 0;
  const isValid = youtubeUrlRegex.test(url.trim());
  const showError = touched && !isEmpty && !isValid;

  return (
    <section className="timestamp" id="how-it-works">
      <h2>How TubeStamp Works</h2>
      <p>Paste a video link, choose key moments, and export clean timestamps.</p>

      <form className="timestamp__form" onSubmit={(e) => e.preventDefault()}>
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
            pattern="^(https?:\/\/)?(www\.)?(youtube\.com\/(watch\?v=|shorts\/|embed\/)|youtu\.be\/)[A-Za-z0-9_-]{11}([?&/#].*)?$"
            aria-invalid={showError ? "true" : "false"}
            aria-describedby={showError ? "youtube-url-error" : undefined}
            required
          />
          <button className="timestamp__button" type="submit" disabled={!isValid}>
            Continue
          </button>
        </div>
        {showError ? (
          <div className="timestamp__error" id="youtube-url-error" role="alert">
            Please enter a valid YouTube URL.
          </div>
        ) : null}
      </form>
    </section>
  );
};

export default Timestamp;
