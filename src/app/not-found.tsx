import { SiteChrome } from "@/components/SiteChrome";

export default function NotFound() {
  return (
    <SiteChrome>
      <div className="page-state-full">
        <div className="page-state">
          <p className="page-state-kicker">404</p>
          <p className="page-state-copy">This page could not be found.</p>
        </div>
      </div>
    </SiteChrome>
  );
}
