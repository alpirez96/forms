# Muhasebe Formları · Gereksinim Prototipi

Muhasebe ekibinin iki formu için hazırlanmış yerel bir test ve karar aracı:

1. **Cari Form** — "Cari Hesap Açılış Talep Formu". Form, *"Fatura mı keseceğim, bana fatura mı kesilecek?"* sorusuyla başlar ve yanıt sonraki deneyimi belirler.
2. **Yeni Talent Form** — "Yeni Talent Formu".

Uygulamada iki formu test eder, notlar alır, kararlarınızı kaydedersiniz. İnceleme bitince her form için **ayrı ve kendi başına yeterli** bir geliştirme promptu üretirsiniz. Bu promptu Claude Code gibi bir kodlama ajanına verebilirsiniz.

> Bu bir prototiptir. Fatura kesmez, e-posta göndermez, hiçbir sisteme veri iletmez. "Gönder" düğmesi yalnızca gönderimi simüle eder.

---

## Kurulum ve çalıştırma

**Gereken:** [Node.js](https://nodejs.org) 18 veya üzeri. Uygulamanın çalışması için başka bağımlılık yoktur.

```bash
npm start
```

Ardından tarayıcıda **http://127.0.0.1:8080** adresini açın. Farklı bir port için: `node scripts/serve.js 3000`.

Node yoksa Python ile de açılabilir:

```bash
python3 -m http.server 8080
```

> `index.html` dosyasına çift tıklayarak açmak çalışmaz (tarayıcılar `file://` üzerinden modül yüklemez). Mutlaka yukarıdaki komutlardan biriyle açın.

---

## Kullanım: önerilen inceleme süreci

1. **Formu seçin.** Üstteki iki karttan *Cari Form* veya *Yeni Talent Form*. İki formun yanıtları, notları, kararları ve promptları tamamen ayrı tutulur.
2. **"Formu test et" sekmesinde formu doldurun.**
   - Cari Form'da ilk adım fatura yönüdür. Bu soru yanıtlanmadan diğer adımlar kilitlidir. Yön, "Cari Türü" kategorilerini değiştirir:
     - **Fatura keseceğim:** Genel Tedarikçi, Satıcı (Ajans), Yurtdışı Satıcı (Ajans), Talent / Influencer
     - **Bana fatura kesilecek:** Müşteri, Yurtdışı Müşteri
   - **Örnek veri doldur** açıkça "ÖRNEK" işaretli sahte veri girer. **Senaryoyu sıfırla** yalnızca test yanıtlarını temizler.
   - Sağdaki **test notları** her adımın kaynağını, koşullu mantığını ve açık sorularını gösterir. Sarı kutular belgelerin yanıt vermediği noktalardır. "Test notlarını göster" kapatılırsa form sade hâliyle görünür.
   - Kaynakta içeriği olmayan sayfalar ("Sayfa 3/6 — içerik yok") ve koşulu bilinmeyen sayfalar (İstisna Belgesi; göster/gizle anahtarı) açıkça işaretlidir.
3. **Not alın.** Her alanın yanındaki **Not** düğmesi, o alana ve branşa bağlı bir geri bildirim açar. Kategori, açıklama, beklenen davranış, durum (Açık / Çözüldü / Ertelendi) ve öncelik girilir. Bölüm için "Bu adım için not ekle"yi kullanın.
4. **İnceledim işareti.** Sağ panelde her bölüm için (Cari'de her iki yön için ayrı) "Bu bölümü inceledim" işaretleyin. Hazırlık durumunda sayılır.
5. **Gereksinimleri gözden geçirin.** "Gereksinimler ve açık sorular" sekmesinde her maddenin kaynak belgesi ve referansı vardır. Durumlar:
   - *Kaynakla doğrulandı* · *Testte benim onayım* · *Önerilen iyileştirme* · *Açık soru* · *Ertelenen karar* · *Reddedildi / kapsam dışı*
   - Açık soruların cevabını **"Cevap / karar notu"** alanına yazıp durumu *Testte benim onayım* yapın. Not prompta aynen girer.
   - Önerileri (ör. e-posta/IBAN format kontrolleri) onaylarsanız prototipte engelleyici hataya dönüşür; reddederseniz kapanır. Öneri durumundayken yalnızca "Öneri" uyarısı gösterilir.
6. **Kararları kaydedin.** Bir notu uygulamaya karar verdiğinizde **Karara dönüştür** deyin. Geri bildirim, siz karar vermeden gereksinim sayılmaz. Karar bir alanı değiştirebilir (etiket, açıklama, zorunluluk, seçenekler, kaldırma) veya yeni alan ekleyebilir. Değişiklik prototipe **hemen** uygulanır ve "Kararla değişti" rozetiyle gösterilir. Cari Form'da karar yalnızca bir branşa da uygulanabilir.
7. **Deneyimi onaylayın.** "Prompt hazırlığı" sekmesinde **Deneyimi final olarak onaylıyorum** düğmesi, prototipin uyguladığı ama belgede olmayan davranışları (gözden geçir adımı, yön değişince kategori temizleme, boşluk kuralı, hata sunumu) onaylı hâle getirir. Böylece prompt, test ettiğiniz deneyimi birebir tanımlar. Onay geri alınabilir.
8. **Promptu üretin.** *Cari Form Geliştirme Promptunu Oluştur* veya *Yeni Talent Form Geliştirme Promptunu Oluştur*. Prompt düzenlenebilir, **Kopyala** ile panoya alınabilir, **.txt** olarak indirilebilir. Bir formun promptu diğerini etkilemez.

### Hazırlık durumu

| Durum | Anlamı |
|---|---|
| **Engelleyici açık soru var** | Taslak prompt üretilebilir. Engellenen kısımlar ayrı bölümde listelenir ve geliştiriciye cevap uydurmaması söylenir. |
| **Taslak** | Açık soru, onay bekleyen öneri, açık not, incelenmemiş bölüm var veya deneyim onaylanmadı. |
| **Hazır** | Açık madde kalmadı. |

### Üretilen promptun içeriği

Her prompt şu bölümleri içerir: amaç ve kapsam · kaynak belgeler ve hedef kitleleri · izlenebilir gereksinimler (zorunlu / opsiyonel / ertelenen / reddedilen) · tam alan envanteri (etiket, açıklama, yer tutucu, seçenekler) · birebir metinler · zorunlu/isteğe bağlı matrisi · koşullu mantık · doğrulama · test edilen deneyim akışı · UX ve erişilebilirlik · onaylı kararlar · açık sorular ve sınırlar · teknik gereksinimler · kabul kriterleri · pozitif/negatif test senaryoları · uç durumlar ve regresyon · mevcut projeyi inceleme talimatı · teslim raporu.

Üretim deterministiktir: aynı inceleme verisi her zaman aynı metni verir. Yapay zekâ servisi veya API anahtarı kullanılmaz.

---

## Verileriniz

- Tüm çalışma tarayıcının yerel deposunda (localStorage) **otomatik** saklanır. Sayfayı yenilemek veya kapatıp açmak veriyi silmez.
- **JSON dışa aktar:** notlar, kararlar, gereksinim durumları ve promptlar tek dosyaya indirilir. **Test yanıtları dosyaya dahil edilmez.**
- **JSON içe aktar:** önceki dosyayı yükler. Dosya doğrulanır, geçersiz kayıtlar atlanıp listelenir, bozuk dosya reddedilir. İçe aktarma mevcut inceleme verisinin yerini alır; test yanıtlarınız korunur.
- Tarayıcı verisi temizlenirse yerel kayıt silinir. Düzenli olarak JSON yedeği alın.
- **Gerçek kişisel, banka veya vergi verisi girmeyin.**

### Bana (Claude'a) geri dönmek için

Dışa aktardığınız JSON dosyasını paylaşırsanız promptları aynı üreticiyle komut satırında da oluşturabilirim:

```bash
npm run prompt -- form-inceleme-2026-10-22.json            # iki prompt, ekrana
npm run prompt -- form-inceleme-2026-10-22.json cari cikti/ # yalnızca Cari, dosyaya
```

---

## Belgeler

| Dosya | İçerik |
|---|---|
| `docs/GEREKSINIM_ENVANTERI.md` | Tüm gereksinimler: kimlik, kaynak belge ve bölüm, açıklama, etkilenen form, tür, güven, uygulama etkisi, açık sorular |
| `docs/ACIK_SORULAR.md` | Onayınızı bekleyen sorular ve kararlar (engelleyiciler, belge çelişkileri, öneriler) |
| `docs/baslangic-promptlari/` | İnceleme öncesi taslak promptlar (yapıyı görmek için) |
| `docs/QA_RAPORU.md` | Test raporu |

Envanter ve açık sorular dosyaları uygulamayla aynı veriden üretilir: `npm run docs`.

**Kaynak belgeler** (`CARI__AC_ILIS__FORMU_MERGED.pdf`, `Yeni_Talent_Formu_MERGED.pdf`, `CARI__AC_ILIS__FORMU-_O_RNEK_S_ABLON.docx`) depoya eklenmedi. Ekran görüntülerinde kişisel veri içerebilecek test değerleri var. Belge metinleri ve notları uygulamadaki "Belge talimatları" sekmesine birebir aktarıldı.

---

## Testler

```bash
npm test             # birim testleri (bağımlılık gerektirmez)
npm install          # bir kez: Playwright (yalnızca uçtan uca testler için)
npx playwright install chromium   # bir kez, tarayıcı yoksa
npm run test:e2e     # gerçek tarayıcıda uçtan uca testler
```

---

## Proje yapısı

```
index.html               Giriş sayfası
assets/styles.css        Stil
src/data/                Kaynak belgelerden çıkarılan veriler (tek doğruluk kaynağı)
  enums.js               Kaynak belgeler, durumlar, kategoriler
  cari.js                Cari Form şeması, belge talimatları, gereksinimler
  talent.js              Yeni Talent Form şeması, belge talimatları, gereksinimler
  shared.js              İki formu birlikte ilgilendiren maddeler
src/core/                Arayüzden bağımsız mantık (Node'da test edilir)
  schema.js              Kararlar uygulanmış "etkin" form şeması
  validation.js          Zorunluluk, dosya ve (onaylıysa) format kontrolleri
  state.js               Durum ve yerel kalıcılık
  importExport.js        JSON dışa/içe aktarma ve doğrulama
  readiness.js           Hazırlık durumu
  prompt.js              Deterministik prompt üretici
src/ui/                  Ekranlar (test, talimatlar, geri bildirim, gereksinimler, kararlar, prompt)
scripts/                 Yerel sunucu, belge üretici, komut satırı prompt üretici
tests/                   Birim ve uçtan uca testler
```

### Gereksinim eklemek veya düzeltmek

Belgelerden gelen her şey `src/data/cari.js` ve `src/data/talent.js` içindedir. Yeni bir madde eklerken kaynak belgeyi (`source`), referansı (`ref`), güven düzeyini ve başlangıç durumunu belirtin. Ardından `npm test` ve `npm run docs` çalıştırın. Testler kırık referansları yakalar.
