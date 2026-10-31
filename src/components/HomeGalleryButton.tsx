"use client";

import { useEffect, useId, useState } from "react";
import { HomeEmbed } from "./HomeEmbed";
import { formatSlideCaption, HOME_SLIDES } from "./home-slides";

export function HomeGalleryButton() {
  const titleId = useId();
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);
  const slide = HOME_SLIDES[index];

  useEffect(() => {
    if (!open) return undefined;

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
      if (event.key === "ArrowLeft") {
        setIndex((current) => (current - 1 + HOME_SLIDES.length) % HOME_SLIDES.length);
      }
      if (event.key === "ArrowRight") {
        setIndex((current) => (current + 1) % HOME_SLIDES.length);
      }
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        className="text-btn home-gallery-open"
        onClick={() => {
          setIndex(0);
          setOpen(true);
        }}
      >
        View Demo Gallery
      </button>
      {open ? (
        <div className="modal-backdrop">
          <button
            type="button"
            className="modal-backdrop-dismiss"
            aria-label="Close gallery"
            onClick={() => setOpen(false)}
          />
          <div
            className="modal home-gallery-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
          >
            <div className="home-gallery-head">
              <p id={titleId} className="home-gallery-title">
                {formatSlideCaption(index)}
              </p>
              <button
                type="button"
                className="home-gallery-close"
                aria-label="Close gallery"
                onClick={() => setOpen(false)}
              >
                ×
              </button>
            </div>
            <div className="home-gallery-stage">
              <button
                type="button"
                className="pager-btn home-gallery-prev"
                aria-label="Previous preview"
                onClick={() =>
                  setIndex(
                    (current) =>
                      (current - 1 + HOME_SLIDES.length) % HOME_SLIDES.length,
                  )
                }
              >
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path
                    d="M15 5 8 12l7 7"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
              <div className="home-gallery-frame">
                <HomeEmbed src={slide.href} title={slide.caption} />
              </div>
              <button
                type="button"
                className="pager-btn home-gallery-next"
                aria-label="Next preview"
                onClick={() =>
                  setIndex((current) => (current + 1) % HOME_SLIDES.length)
                }
              >
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path
                    d="M9 5l7 7-7 7"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>
            <p className="home-gallery-count">
              {index + 1} / {HOME_SLIDES.length}
            </p>
          </div>
        </div>
      ) : null}
    </>
  );
}
