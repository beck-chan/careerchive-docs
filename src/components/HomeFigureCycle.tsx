"use client";

import { useEffect, useState } from "react";
import { HomeEmbed } from "./HomeEmbed";
import { formatSlideCaption, HOME_SLIDES } from "./home-slides";

const INTERVAL_MS = 6000;
const FADE_MS = 1200;

function slideClass(slideIndex: number, index: number, outgoing: number | null) {
  if (slideIndex === index) return "home-figure is-active";
  if (slideIndex === outgoing) return "home-figure is-outgoing";
  return "home-figure";
}

function slideMounted(slideIndex: number, index: number, outgoing: number | null) {
  if (slideIndex === index || slideIndex === outgoing) return true;
  return slideIndex === (index + 1) % HOME_SLIDES.length;
}

export function HomeFigureCycle() {
  const [index, setIndex] = useState(0);
  const [outgoing, setOutgoing] = useState<number | null>(null);

  useEffect(() => {
    const id = window.setTimeout(() => {
      setOutgoing(index);
      setIndex((current) => (current + 1) % HOME_SLIDES.length);
    }, INTERVAL_MS);
    return () => window.clearTimeout(id);
  }, [index]);

  useEffect(() => {
    if (outgoing === null) return undefined;
    const id = window.setTimeout(() => setOutgoing(null), FADE_MS);
    return () => window.clearTimeout(id);
  }, [outgoing]);

  return (
    <>
      <div className="home-figure-cycle" aria-live="polite">
        {HOME_SLIDES.map((slide, slideIndex) =>
          slideMounted(slideIndex, index, outgoing) ? (
            <div
              key={slide.href}
              className={slideClass(slideIndex, index, outgoing)}
            >
              <HomeEmbed
                live={slideIndex === index}
                src={slide.href}
                title={slide.caption}
              />
            </div>
          ) : null,
        )}
      </div>
      <div className="home-captions">
        {HOME_SLIDES.map((slide, slideIndex) => (
          <p
            key={slide.caption}
            className={`home-caption${slideIndex === index ? " is-active" : ""}`}
          >
            {formatSlideCaption(slideIndex)}
          </p>
        ))}
      </div>
    </>
  );
}
