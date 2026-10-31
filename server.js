const path = require('path');
const express = require('express');
const compression = require('compression');

const profile = require('./data/profile');
const github = require('./services/github');

const app = express();
const PORT = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.disable('x-powered-by');
app.locals.assetVersion = Date.now().toString(36); // busts CSS/JS caches on each restart

app.use(compression());
const isProd = process.env.NODE_ENV === 'production';
app.use(express.static(path.join(__dirname, 'public'), { maxAge: isProd ? '1h' : 0 }));

app.get('/', async (req, res, next) => {
  try {
    const projects = await github.getProjects(profile.projects);
    res.render('index', { profile, projects, year: new Date().getFullYear() });
  } catch (err) {
    next(err);
  }
});

// Live GitHub stats for the featured projects (cached for an hour).
app.get('/api/projects', async (req, res, next) => {
  try {
    res.json(await github.getProjects(profile.projects));
  } catch (err) {
    next(err);
  }
});

app.get('/resume', (req, res) => {
  res.download(path.join(__dirname, 'public', 'assets', 'Hanzala_Rashid_Resume.pdf'));
});

app.get('/healthz', (req, res) => res.json({ ok: true }));

app.use((req, res) => res.redirect('/'));

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send('Something went wrong.');
});

app.listen(PORT, () => {
  console.log(`Portfolio running at http://localhost:${PORT}`);
  github.getProjects(profile.projects).catch(() => {}); // warm the cache
});
