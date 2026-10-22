# QA Raporu

**Tarih:** 2026-10-22 · **Ortam:** Node.js 22, Chromium (Playwright 1.56.1), masaüstü 1360 px ve mobil 375 px görünüm

## Özet

| Paket | Komut | Sonuç |
|---|---|---|
| Birim testleri (envanter ve yönlendirme tutarlılığı, şema, doğrulama, içe/dışa aktarma ve sürüm geçişi, tek dosya paketi, yerel sunucu) | `npm test` | **27 / 27 geçti** |
| Uçtan uca testler, yerel sunucu üzerinden (gerçek tarayıcı) | `npm run test:e2e` | **19 / 19 geçti** |
| Uçtan uca testler, tek dosya `file://` ile açılmış | `E2E_TARGET=tek-dosya npm run test:e2e` | **19 / 19 geçti** |

> **Kapsam değişikliği (kullanıcı kararı):** Prompt üretici uygulamadan çıkarıldı. Uygulama artık yalnızca formu test etmek, not almak ve notları JSON olarak indirmek içindir. Geliştirme promptları bu JSON dosyasından ayrıca hazırlanır. Platform, mimari ve kimlik doğrulama gibi teknik kararlar geliştiriciye bırakıldı (C-Q08). Bu nedenle C-Q09 ve T-Q06 yalnızca "talep kime ulaşmalı" sorusuna indirildi ve engelleyici olmaktan çıktı.
| Tarayıcı konsol hatası | tüm uçtan uca testlerde denetlendi | **Yok** |

## Brif kontrol listesi (Aşama 7)

| Kontrol | Nasıl doğrulandı | Sonuç |
|---|---|---|
| İki form bağımsız erişilebilir | E2E: form seçici, başlıklar, alanlar | Geçti |
| Cari'de ilk soru diğer alanlardan önce | E2E: ilk ekranda başka alan yok, ilk adım dışındaki tüm adımlar kilitli, yanıtsız ilerleme engellenir | Geçti |
| Yön değişince koşullu alanlar güncellenir | E2E + birim: kategori listeleri branşa göre; geçersiz seçim temizlenir, diğer yanıtlar korunur | Geçti |
| Canlı formdaki sayfa yönlendirmesi | E2E: Şirket/Belge Türü'nün dört farklı yanıtı için ziyaret edilen sayfa sırası; birim: tüm yollar | Geçti |
| Formlar arasında veri ve geri bildirim karışmaz | E2E: yanıt, not ve karar ayrımı; birim: kararlar diğer formun şemasını etkilemez, içe aktarımda kimlikler forma göre süzülür | Geçti |
| Zorunlu alanlar ve belgelenmiş doğrulamalar | E2E: Talent'ta 8 zorunlu alan hatası, odak ilk hatada, 10 MB ve görsel türü kontrolü, TC Kimlik No 11 karakter sınırı; birim: tüm kısıtlar ve Vergi No 15 karakter sınırı | Geçti |
| Belge talimatları doğru yansıtılıyor | Birim: alan sırası, seçenekler, yönlendirme ve gereksinim referansları kaynak verisiyle tutarlı; E2E: gönderim sonrası onay mesajı birebir | Geçti |
| Belirsizlikler uydurulmak yerine işaretleniyor | E2E: koşula bağlı belirsizlik notları ve belge çelişkileri test notlarında; açık sorular "Gereksinimler" sekmesinde | Geçti |
| Geri bildirim sayfa yenilemede korunuyor | E2E: yenileme sonrası notlar, yanıtlar ve açık soru cevap notları duruyor | Geçti |
| JSON dışa/içe aktarma | E2E: dışa aktar → yeni oturumda içe aktar; bozuk dosya hata verir ve mevcut veriyi bozmaz; test yanıtları dışa aktarılmaz. Birim: sürüm 1 dosyaları yeni sayfa kimliklerine taşınır | Geçti |
| Onaylı kararlar prototipe yansıyor | E2E: K-C-001 yalnızca "Bana fatura kesilecek" yönünde IBAN'ı isteğe bağlı yapıyor; karar Talent formunda görünmüyor | Geçti |
| Yerel çalıştırma | Tek dosya (`dist/muhasebe-form-prototipi.html`) çift tıklamayla açılır ve tüm E2E akışları bu dosyada da geçer. `npm start` tarayıcıyı kendisi açar; port doluysa sıradaki boş porta geçer (birim testi). Kaynak `index.html` `file://` ile açılırsa tek dosyaya yönlendiren mesaj gösterir | Geçti |
| Tek dosya güncelliği | Birim: paket tüm `src` modüllerini içerir, `import`/`export` kalmaz, sözdizimi geçerli; depodaki dosya kaynaktan yeniden üretilenle birebir aynı | Geçti |
| Notları indir (JSON) | E2E: ana düğme iki formun notlarını tek dosyada indirir; test yanıtları ve prompt alanı dosyada yok; Final düğmesi ve prompt sekmesi yok | Geçti |
| Çalışma zamanı hatası / kırık etkileşim | Tüm E2E akışlarında konsol ve sayfa hatası denetimi | Yok |

## Canlı form tanımının (DOC-D) etkisi

Kaydedilmiş Google Forms sayfasındaki gömülü form tanımı okundu. Ekranda görünmeyen sayfalar da bu tanımda yer alıyor.

**Cevaplanan engelleyiciler:**
- **C-Q01** eksik sayfalar: Sayfa 3/6 "TC Kimlik No", Sayfa 4/6 "Vergi Bilgileri - Vergi Dairesi".
- **C-Q02** Şirket/Belge Türü seçenekleri: Limited / Anonim Şirketi, Şahıs Firması, İstisna Belgesi, Serbest Meslek Makbuzu, Gider Pusulası.
- **C-Q03** yönlendirme: İstisna Belgesi sayfası yalnızca aynı adlı seçenekte açılıyor.

**Kısmen cevaplanan:**
- **C-Q04:** Ülke listesi artık biliniyor. Engelleyici olmaktan çıktı; açık soru olarak kaldı.

**Yeni bilgiler:**
- Uzunluk kuralları: Vergi No en fazla 15, TC Kimlik No en fazla 11 karakter.
- İl ve İlçe ile Adres uzun metin alanı.
- Onay mesajı.
- Gizlilik bağlantısının adresi.
- Boş, teknik "Submit" bölümü.

**Yeni çelişki:**
- **C-Q13:** Vergi Dairesi sayfası DOC-A'da 6/6, canlı formda 4/6. Form ekran görüntülerinden sonra değiştirilmiş görünüyor.

## Test sırasında bulunup düzeltilen hatalar

1. Alan hedefli geri bildirimden karar oluşturulurken "Mevcut alanı değiştir" modu açılmıyordu. Varsayılan `{kind: 'none'}` değeri boş sayılmıyordu. Düzeltildi; E2E ile doğrulandı.
2. Radyo sorularında kaynak çipleri dar bir sütuna sıkışıyordu (CSS float temizliği). Düzeltildi; ekran görüntüsüyle doğrulandı.
3. `npm start`, port doluyken hem dolu portu hem yeni portu "çalışıyor" diye yazıyordu. Tarayıcıyı da yanlış adrese açabilirdi. Neden: başarısız denemenin dinleyicisi sonraki portta tetikleniyordu. Her deneme artık kendi dinleyicilerini temizliyor; birim testine eklendi.

## Açık kalanlar (uygulama dışı, iş kararı gerektiren)

Bunlar prototipin hatası değil; kaynak belgelerin yanıt vermediği konulardır. Ayrıntı: `docs/ACIK_SORULAR.md`.

- **Engelleyici:** yok. C-Q09 (Cari) ve T-Q06 (Talent) açık kaldı: gönderilen talep kime ulaşmalı (Talent'ta ayrıca gönderim sonrası mesaj). Platform ve veri saklama geliştiricinin kararı.
- **Belge çelişkileri:**
  - C-Q06: formu kim dolduruyor, karşı taraf mı DOME personeli mi?
  - C-Q13: DOC-A ile canlı form arasındaki sayfa numarası farkı.
- **Önemli diğer sorular:**
  - C-Q04: yurtdışı cariler için alanlar.
  - C-Q05: "Bana fatura kesilecek" yönünde IBAN, bilgilendirme ve Şirket/Belge Türü yönlendirmesi.
  - C-Q07: gizlilik bağlantısının düzeltilmesi.

## Sınırlamalar

- Dosyalar yüklenmez ve saklanmaz; yalnızca ad, boyut ve tür kontrol edilir. İstisna Belgesi'nin dosya ayarları canlı form tanımında yer almıyor (C-Q12).
- Bölüm sonu yönlendirmeleri, Google Forms'un bu bilgiyi bir sonraki bölüm başlığında saklama kuralına göre okundu (C-042, güçlü çıkarım). Seçeneklere bağlı yönlendirmeler doğrudan tanımdan alındı.
- Veriler tarayıcıya özeldir; farklı tarayıcı/cihaz arasında taşımak için "Notları indir (JSON)" ve "JSON içe aktar" kullanılır.
