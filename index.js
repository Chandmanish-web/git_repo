import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { db, init } from './db/lowdb.js';

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.static(path.join(__dirname, "public")));


app.use(express.urlencoded({ extended: true }));

app.use(express.json());

app.get("/", (req, res) => {
  res.render("index", { title: "Home Page" });
});

app.get("/about", (req, res) => {
  res.render("about", { title: "About Page" });
});


app.get('/services/home-repairs', (req, res) => res.render('services-home-repairs'));
app.get('/services/installations', (req, res) => res.render('services-installations'));
app.get('/services/cleaning', (req, res) => res.render('services-cleaning'));
app.get('/services/custom-projects', (req, res) => res.render('services-custom-projects'));


app.get('/admin', async (req, res) => {
  try{
    await db.read();
    const data = db.data;
    res.render('admin', { ...data });
  }catch(err){
    console.error('Admin read error', err);
    res.status(500).send('Server error');
  }
});

// Download raw data.json
app.get('/admin/download', (req, res) => {
  res.download(path.join(__dirname, 'data.json'));
});

// Clear stored data (contacts/startnow/all)
app.post('/admin/clear', async (req, res) => {
  const which = req.body.which || 'all';
  try{
    await db.read();
    if(which === 'contacts' || which === 'all') db.data.contacts = [];
    if(which === 'startnow' || which === 'all') db.data.startnow = [];
    await db.write();
    res.redirect('/admin');
  }catch(err){
    console.error('Admin clear error', err);
    res.status(500).send('Server error');
  }
});

app.post('/contact', async (req, res) => {
  console.log('Contact form received:', req.body);
  try{
    await db.read();
    db.data.contacts.push({ ...req.body, createdAt: new Date().toISOString() });
    await db.write();
    return res.json({ ok: true });
  }catch(err){
    console.error('DB write error /contact', err);
    return res.status(500).json({ ok: false });
  }
});

app.post('/startnow', async (req, res) => {
  console.log('Start Now submission:', req.body);
  try{
    await db.read();
    db.data.startnow.push({ ...req.body, createdAt: new Date().toISOString() });
    await db.write();
    return res.json({ ok: true });
  }catch(err){
    console.error('DB write error /startnow', err);
    return res.status(500).json({ ok: false });
  }
});

app.post('/signin', (req, res) => {
  console.log('Sign in attempt:', req.body);
  // Dummy response: accept any non-empty email/password for now
  if(req.body && req.body.email && req.body.password){
    return res.json({ ok: true });
  }
  res.status(400).json({ ok: false, error: 'missing credentials' });
});

// initialize DB then start server
init().then(()=>{
  app.listen(3000, () => {
    console.log("Server is running on http://localhost:3000");
  });
}).catch(err=>{
  console.error('Failed to initialize DB', err);
  process.exit(1);
});

