const DEMO_ORIGIN = "https://careerchive-demo.vercel.app";

const DEMO_PATHS = new Set(["/", "/overview", "/search", "/organizations"]);

// Keep every page's right rail in the layout, at a fixed width, so the frame
// crop does not slice off Period or Add Organization.
const RAIL_STYLE =
  ".org-layout{grid-template-columns:10% minmax(0,1fr) 17.5rem !important}";

const MEASURE_SCRIPT = `(function(){
  var css=${JSON.stringify(RAIL_STYLE)};
  var last="";
  function box(el){
    if(!el) return null;
    var s=getComputedStyle(el);
    if(s.display==="none"||s.visibility==="hidden") return null;
    var r=el.getBoundingClientRect();
    if(r.width<2||r.height<2) return null;
    return r;
  }
  function apply(){
    var s=document.getElementById("embed-rail-fix");
    if(!s){s=document.createElement("style");s.id="embed-rail-fix";document.documentElement.appendChild(s)}
    if(s.textContent!==css) s.textContent=css;
    var nodes=document.querySelectorAll(".org-sidebar,.org-day,.org-filters,.org-calendar");
    var right=0,bottom=0;
    for(var i=0;i<nodes.length;i++){
      var r=box(nodes[i]);
      if(!r) continue;
      right=Math.max(right,r.right);
      bottom=Math.max(bottom,r.bottom);
    }
    var header=document.querySelector(".app-header");
    if(header&&right){
      header.style.width=Math.ceil(right)+"px";
      header.style.maxWidth=Math.ceil(right)+"px";
      var hr=box(header);
      if(hr) bottom=Math.max(bottom,hr.bottom);
    }
    var main=box(document.querySelector(".app-main"));
    if(main) bottom=Math.max(bottom,main.bottom);
    if(right<100||bottom<100) return;
    right=Math.min(innerWidth,Math.ceil(right+8));
    bottom=Math.min(innerHeight,Math.ceil(bottom+8));
    var key=right+"x"+bottom;
    if(key===last) return;
    last=key;
    parent.postMessage({source:"careerchive-embed",width:right,height:bottom},"*");
  }
  apply();
  addEventListener("DOMContentLoaded",apply);
  addEventListener("load",apply);
  setTimeout(apply,400);
  setTimeout(apply,1200);
})();`;

function demoPath(value: string | null) {
  if (!value || !value.startsWith("/") || value.includes("\\") || value.includes("//")) {
    return null;
  }
  let url: URL;
  try {
    url = new URL(value, DEMO_ORIGIN);
  } catch {
    return null;
  }
  if (url.origin !== DEMO_ORIGIN || !DEMO_PATHS.has(url.pathname)) return null;
  return `${url.pathname}${url.search}`;
}

export async function GET(request: Request) {
  const path = demoPath(new URL(request.url).searchParams.get("path"));
  if (!path) return new Response("Not found", { status: 404 });

  const upstream = await fetch(`${DEMO_ORIGIN}${path}`, {
    cache: "no-store",
    headers: { accept: "text/html" },
  });
  if (!upstream.ok) return new Response("Demo unavailable", { status: 502 });

  const html = await upstream.text();
  const inject = `<base href="${DEMO_ORIGIN}/"><script>${MEASURE_SCRIPT}</script>`;
  const body = html.replace(/<head([^>]*)>/i, `<head$1>${inject}`);

  return new Response(body, {
    status: 200,
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });
}
