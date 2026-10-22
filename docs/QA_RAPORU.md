# QA Raporu

**Tarih:** 2026-10-22 · **Ortam:** Node.js 22, Chromium (Playwright 1.56.1), masaüstü 1360 px ve mobil 375 px görünüm

## Özet

| Paket | Komut | Sonuç |
|---|---|---|
| Birim testleri (envanter, şema, doğrulama, içe/dışa aktarma, prompt, hazırlık) | `npm test` | **34 / 34 geçti** |
| Uçtan uca testler (gerçek tarayıcı) | `npm run test:e2e` | **15 / 15 geçti** (art arda iki çalıştırmada) |
| Tarayıcı konsol hatası | tüm uçtan uca testlerde denetlendi | **Yok** |

## Brif kontrol listesi (Aşama 7)

| Kontrol | Nasıl doğrulandı | Sonuç |
|---|---|---|
| İki form bağımsız erişilebilir | E2E: form seçici, başlıklar, alanlar | Geçti |
| Cari'de ilk soru diğer alanlardan önce | E2E: ilk ekranda başka alan yok, adımlar kilitli, yanıtsız ilerleme engellenir | Geçti |
| Yön değişince koşullu alanlar güncellenir | E2E + birim: kategori listeleri branşa göre; geçersiz seçim temizlenir, diğer yanıtlar korunur | Geçti |
| Formlar arasında veri ve geri bildirim karışmaz | E2E: yanıt, not ve prompt ayrımı; birim: kararlar diğer formun şemasını etkilemez, içe aktarımda kimlikler forma göre süzülür | Geçti |
| Zorunlu alanlar ve belgelenmiş doğrulamalar | E2E: Talent'ta 8 zorunlu alan hatası, odak ilk hatada, 10 MB ve görsel türü kontrolü; birim: tüm kısıtlar | Geçti |
| Belge talimatları doğru yansıtılıyor | Birim: alan sırası, seçenekler ve birebir metinler prompta aktarılıyor | Geçti |
| Belirsizlikler uydurulmak yerine işaretleniyor | Birim + E2E: koşula bağlı belirsizlik notları, eksik sayfalar, koşulu bilinmeyen sayfa, promptta açık soru bölümleri | Geçti |
| Geri bildirim sayfa yenilemede korunuyor | E2E: yenileme sonrası notlar, yanıtlar ve elle düzenlenmiş prompt duruyor | Geçti |
| JSON dışa/içe aktarma | E2E: dışa aktar → yeni oturumda içe aktar; bozuk dosya hata verir ve mevcut veriyi bozmaz; test yanıtları dışa aktarılmaz | Geçti |
| Onaylı kararlar doğru prompta giriyor | E2E: K-C-001 Cari promptunda var, Talent promptunda yok; alan envanteri branşa göre güncelleniyor | Geçti |
| Açık sorular promptta görünüyor | Birim + E2E: "12.1 Engelleyici sorular", kimlikler ve "cevap uydurma" talimatı | Geçti |
| İki prompt bağımsız | Birim: Cari promptunda Talent alanı yok, Talent promptunda Cari alanı yok; 18 bölüm her ikisinde | Geçti |
| Yerel çalıştırma | `npm start` ve `python3 -m http.server`; `file://` ile açılırsa yönlendirme mesajı | Geçti |
| Çalışma zamanı hatası / kırık etkileşim | Tüm E2E akışlarında konsol ve sayfa hatası denetimi | Yok |

## Ek kontroller

- **Erişilebilirlik:** Her giriş, seçim ve metin alanının erişilebilir etiketi var (E2E). Hatalar `aria-invalid` ve `aria-describedby` ile bağlı. Hata özetindeki bağlantılar alana götürüyor.
- **Mobil:** 375 px genişlikte tüm sekmelerde yatay taşma yok (E2E).
- **Determinizm:** Aynı veriyle prompt metni birebir aynı; zaman damgası içermiyor (birim).
- **Güvenlik:** Dinamik metin yalnızca `textContent` ile basılıyor. İçe aktarılan HTML benzeri metin düz metin olarak kalıyor (birim).

## Test sırasında bulunup düzeltilen hatalar

1. Alan hedefli geri bildirimden karar oluşturulurken "Mevcut alanı değiştir" modu açılmıyordu. Varsayılan `{kind: 'none'}` değeri boş sayılmıyordu. Düzeltildi; E2E ile doğrulandı.
2. Radyo sorularında kaynak çipleri dar bir sütuna sıkışıyordu (CSS float temizliği). Düzeltildi; ekran görüntüsüyle doğrulandı.
3. Talent promptunda Cari'ye özgü terimler (IBAN, vergi) genel satırlardan sızıyordu. Forma özel yapıldı; birim testine eklendi.
4. Promptta onaylanmamış prototip davranışları (gözden geçir adımı, kategori temizleme, boşluk kuralı) test senaryolarında zorunlu gibi yazılıyordu. Senaryolar artık her davranışın onay durumuna göre üretiliyor; birim testine eklendi.
5. Türkçe büyük harf dönüşümü ("ENGELLEYICI") düzeltildi (`tr-TR`).

## Açık kalanlar (uygulama dışı, iş kararı gerektiren)

Bunlar prototipin hatası değil; kaynak belgelerin yanıt vermediği konulardır. Ayrıntı: `docs/ACIK_SORULAR.md`.

- **Engelleyici (Cari):** C-Q01 eksik sayfalar 3/6 ve 4/6 · C-Q02 Şirket/Belge Türü seçenekleri · C-Q03 sayfa yönlendirmeleri ve İstisna Belgesi koşulu · C-Q04 yurtdışı cariler ile Türkiye'ye özgü zorunlu alanlar · C-Q09 gönderim hedefi ve platform
- **Engelleyici (Talent):** T-Q06 gönderim hedefi ve platform
- **Belge çelişkileri:** C-Q04, C-Q06 (formu kim dolduruyor: karşı taraf mı, DOME personeli mi)

## Sınırlamalar

- Dosyalar yüklenmez ve saklanmaz; yalnızca ad, boyut ve tür kontrol edilir.
- Veriler tarayıcıya özeldir; farklı tarayıcı/cihaz arasında taşımak için JSON dışa/içe aktarma kullanılır.
- Kopyalama düğmesi tarayıcının pano iznine bağlıdır. İzin yoksa metin elle seçilebilir veya .txt indirilebilir.
