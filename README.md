# Lezzet Rotası Tarifleri

Lezzet Rotası uygulamasından "Siteye koy" ile eklenen tariflerin herkese açık sitesi:
https://gundogar2424.github.io/lezzet-tarifler/

- `t/` : tarif sayfaları (schema.org Recipe verisiyle; Cookidoo "Mevcut bir tarifi içe aktar" okuyabilir)
- `index.html` : ana sayfa, arama ve kategoriler (`tarifler.json`'dan okur)
- `scripts/derle.js` : her push'ta `tarifler.json` ve `sitemap.xml` üretir (GitHub Actions)
