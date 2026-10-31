export const DOCS_LIVE_PREVIEW_SCRIPT = `(function(){
  if (window.__careerChiveDocsLivePreview) return;
  window.__careerChiveDocsLivePreview = true;
  var last = "";
  function poll(){
    fetch("/docs/watch", { cache: "no-store" })
      .then(function(r){ return r.ok ? r.text() : ""; })
      .then(function(tick){
        if (last && tick && tick !== last) location.reload();
        if (tick) last = tick;
      })
      .catch(function(){});
  }
  poll();
  setInterval(poll, 400);
})();`;
