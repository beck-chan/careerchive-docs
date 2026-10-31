import Guide from "./content.mdx";

export default function Home() {
  return (
    <>
      <article className="mdx-page is-home">
        <Guide />
      </article>
      <p className="home-built-by">
        Built by{" "}
        <a
          href="https://beck-chan.github.io/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Beck Chan
        </a>
      </p>
    </>
  );
}
