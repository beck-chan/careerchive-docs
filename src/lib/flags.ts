function envFlag(value: string | undefined, fallback: boolean) {
  if (value === undefined || value === "") return fallback;
  return value === "true" || value === "1";
}

export const flags = {
  // Static process.env.* access so Next can inline this for the proxy.
  // Default true: /beck exists once the WIP host installs career-chive.
  // npm run docs sets FLAG_APP=false so /beck is not served.
  app: envFlag(process.env.FLAG_APP, true),
};
