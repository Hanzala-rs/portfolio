// Pulls live stats (stars, languages, last push, homepage) for the featured repos.
// Results are cached in memory; if GitHub is slow or rate-limited the page still
// renders with the curated data from data/profile.js.

const OWNER = 'Hanzala-rs';
const TTL_MS = 60 * 60 * 1000;
const WAIT_MS = 2500;

let cache = { at: 0, data: {} };
let inflight = null;

function headers() {
  const h = { 'User-Agent': 'hanzala-portfolio', Accept: 'application/vnd.github+json' };
  if (process.env.GITHUB_TOKEN) h.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  return h;
}

async function fetchRepo(name) {
  const base = `https://api.github.com/repos/${OWNER}/${name}`;
  const [repoRes, langRes] = await Promise.all([
    fetch(base, { headers: headers() }),
    fetch(`${base}/languages`, { headers: headers() }),
  ]);
  if (!repoRes.ok) throw new Error(`${name}: HTTP ${repoRes.status}`);

  const repo = await repoRes.json();
  const langs = langRes.ok ? await langRes.json() : {};
  return {
    stars: repo.stargazers_count,
    forks: repo.forks_count,
    pushedAt: repo.pushed_at,
    homepage: repo.homepage || null,
    languages: Object.keys(langs),
  };
}

function refresh(projects) {
  if (!inflight) {
    inflight = Promise.allSettled(projects.map((p) => fetchRepo(p.repo)))
      .then((results) => {
        results.forEach((r, i) => {
          if (r.status === 'fulfilled') cache.data[projects[i].repo] = r.value;
          else console.warn('[github]', r.reason.message);
        });
        cache.at = Date.now();
      })
      .finally(() => {
        inflight = null;
      });
  }
  return inflight;
}

async function getProjects(projects) {
  if (Date.now() - cache.at > TTL_MS) {
    await Promise.race([refresh(projects), new Promise((r) => setTimeout(r, WAIT_MS))]);
  }
  return projects.map((p) => {
    const live = cache.data[p.repo];
    return {
      ...p,
      url: `https://github.com/${OWNER}/${p.repo}`,
      demo: p.demo || (live && live.homepage) || null,
      live: live || null,
    };
  });
}

module.exports = { getProjects };
