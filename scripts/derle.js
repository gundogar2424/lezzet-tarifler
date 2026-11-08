// t/*.html icindeki schema.org Recipe (JSON-LD) verisinden tarifler.json ve sitemap.xml uretir.
// Node 20, bagimlilik yok. Calistir: node scripts/derle.js
const fs = require('fs')
const path = require('path')

const KOK = path.join(__dirname, '..')
const SITE = process.env.SITE_URL || 'https://gundogar2424.github.io/lezzet-tarifler'
const klasor = path.join(KOK, 't')
if (!fs.existsSync(klasor)) fs.mkdirSync(klasor)

const tarifler = []
for (const dosya of fs.readdirSync(klasor).filter((d) => d.endsWith('.html')).sort()) {
  const html = fs.readFileSync(path.join(klasor, dosya), 'utf8')
  const m = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)
  if (!m) continue
  let v
  try { v = JSON.parse(m[1]) } catch { continue }
  if (v['@type'] !== 'Recipe') continue
  const st = fs.statSync(path.join(klasor, dosya))
  const tarihM = html.match(/<meta name="lz-tarih" content="([^"]+)"/)
  tarifler.push({
    dosya: `t/${dosya}`,
    ad: v.name || dosya,
    aciklama: (v.description || '').slice(0, 160),
    kategori: v.recipeCategory || '',
    etiketler: String(v.keywords || '').split(',').map((s) => s.trim()).filter(Boolean),
    porsiyon: v.recipeYield || '',
    sure: v.totalTime ? Number(String(v.totalTime).replace(/\D/g, '')) || 0 : 0,
    yazar: v.author?.name || '',
    thermomix: /thermomix/i.test(String(v.keywords || '')) ,
    gorsel: Array.isArray(v.image) ? v.image[0] : v.image || '',
    tarih: tarihM ? tarihM[1] : st.mtime.toISOString().slice(0, 10)
  })
}
tarifler.sort((a, b) => (a.tarih < b.tarih ? 1 : a.tarih > b.tarih ? -1 : a.ad.localeCompare(b.ad, 'tr')))
fs.writeFileSync(path.join(KOK, 'tarifler.json'), JSON.stringify(tarifler, null, 1))

const urls = [{ loc: `${SITE}/`, tarih: new Date().toISOString().slice(0, 10), oncelik: '1.0' }, ...tarifler.map((t) => ({ loc: `${SITE}/${t.dosya}`, tarih: t.tarih, oncelik: '0.8' }))]
fs.writeFileSync(
  path.join(KOK, 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls
    .map((u) => `  <url><loc>${u.loc}</loc><lastmod>${u.tarih}</lastmod><priority>${u.oncelik}</priority></url>`)
    .join('\n')}\n</urlset>\n`
)
console.log(`${tarifler.length} tarif -> tarifler.json, sitemap.xml`)
