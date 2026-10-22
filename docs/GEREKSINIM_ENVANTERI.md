# Gereksinim Envanteri

> Bu dosya `npm run docs` ile `src/data/` altındaki verilerden otomatik üretilir; elle düzenlemeyin. Uygulamadaki "Gereksinimler ve açık sorular" ekranı aynı veriyi gösterir.

Durumlar başlangıç (inceleme öncesi) durumlarıdır. Testte verdiğiniz kararlar uygulamada saklanır ve JSON dışa aktarımına girer.

## Kaynak belgeler

| Kimlik | Belge | Dosya | İçerik |
|---|---|---|---|
| DOC-A | Cari Hesap Açılış Talep Formu – birleştirilmiş ekran görüntüleri (PDF) | CARI__AC_ILIS__FORMU_MERGED.pdf | Google Forms üzerindeki mevcut "Cari Hesap Açılış Talep Formu"nun 5 PDF sayfalık ekran görüntüsü. PDF sayfa 1–2 = form sayfası 1/6, PDF sayfa 3 = 2/6, PDF sayfa 4 = 5/6, PDF sayfa 5 = 6/6. Form sayfaları 3/6 ve 4/6 belgede yer almıyor. Alanlara test amaçlı değerler girilmiş; bu değerler gereksinim değildir. |
| DOC-B | Yeni Talent Formu – ekran görüntüsü ve seçenek notları (PDF) | Yeni_Talent_Formu_MERGED.pdf | Google Forms üzerindeki "Yeni Talent Formu"nun tek sayfalık ekran görüntüsü. Sağ tarafta kırmızı oklarla "Kategori – Seçenekler" ve "Belge Tipi – Seçenekler" açılır listeleri gösterilmiş. |
| DOC-C | Cari Açılış Formu – Örnek Şablon (DOCX, değişiklik notları) | CARI__AC_ILIS__FORMU-_O_RNEK_S_ABLON.docx | Cari formunun 5 ekran görüntüsü ve aralarında kırmızı-kalın yazılmış değişiklik notları (P002, P004–P012, P014). Word yorumu veya izlenen değişiklik içermez. Notlar muhasebe ekibinin form tasarımına yönelik değişiklik talepleridir. |
| BRIEF | Proje brifi (kullanıcı talimatı) | — | Bu prototipi isteyen proje brifi. Cari Form için ilk sorunun "Fatura mı keseceğim, bana fatura mı kesilecek?" olmasını ve iki seçeneğin "Fatura keseceğim" / "Bana fatura kesilecek" olmasını zorunlu kılar. |
| ANALIZ | Analist önerisi (kaynak belgelerde yok) | — | Belgelerde tanımlı olmayan, yalnızca öneri olarak sunulan maddeler. Onaylanmadıkça gereksinim sayılmaz. |

Güven düzeyleri: **Açıkça belgelenmiş** (belgede birebir görünür) · **Güçlü çıkarım** (belgeden doğrudan çıkarılır ama ifade kesin değil) · **Belirsiz** (belge yanıt vermiyor).

## Cari Form (52 madde)

| Kimlik | Tür | Güven | Başlangıç durumu | Kaynak | Özet |
|---|---|---|---|---|---|
| C-001 | İşlevsel | Açıkça belgelenmiş | Kaynakla doğrulandı | BRIEF | Zorunlu ilk soru "Fatura mı keseceğim, bana fatura mı kesilecek?" diğer tüm alanlardan önce gösterilir. Seçenekler: "Fatura keseceğim" ve… |
| C-002 | İş kuralı | Güçlü çıkarım | Kaynakla doğrulandı | DOC-C, DOC-A | "Cari Türü" alanındaki "Marka" ve "Ajans" seçenekleri yerine fatura yönüne göre kategori kırılımı kullanılır. Fatura keseceğim → Genel Te… |
| C-003 | İş kuralı | Güçlü çıkarım | Kaynakla doğrulandı | DOC-C, BRIEF | Branş eşleşmesi: DOCX'teki "Fatura kesecekseniz…" listesi "Fatura keseceğim" branşına; "Size fatura keseceksek…" listesi "Bana fatura kes… |
| C-004 | İçerik | Açıkça belgelenmiş | Kaynakla doğrulandı | DOC-A, DOC-C | Form başlığı: "Cari Hesap Açılış Talep Formu". |
| C-005 | İçerik | Açıkça belgelenmiş | Kaynakla doğrulandı | DOC-A, DOC-C | Giriş metni birebir gösterilir: "Sistemimize tedarikçi veya müşteri olarak eklenmeniz ve faturalarınızın zamanında işleme alınabilmesi iç… |
| C-006 | İş kuralı | Açıkça belgelenmiş | Kaynakla doğrulandı | DOC-A, DOC-C | Bilgilendirme "PO Numarası Zorunluluğu" birebir gösterilir: "Tüm tedarikçi faturalarında "E" harfi ile başlayan geçerli bir Satın Alma Si… |
| C-007 | İçerik | Açıkça belgelenmiş | Kaynakla doğrulandı | DOC-A, DOC-C | Bilgilendirme "Fatura Gönderimi" birebir gösterilir: "E-arşiv ve kağıt faturalarınızı lütfen PDF formatında ilgili e-posta adreslerimize … |
| C-008 | İçerik | Açıkça belgelenmiş | Kaynakla doğrulandı | DOC-A, DOC-C | Gizlilik onay metni gösterilir: "Bu formu doldurarak bu linkten ulaşabileceğiniz gizlilik politikamızı kabul etmiş sayılırsınız." İkinci … |
| C-009 | İşlevsel | Açıkça belgelenmiş | Kaynakla doğrulandı | DOC-C | Mevcut formda gizlilik politikası bağlantısı boş sayfa açıyor; bağlantı çalışan bir gizlilik politikası sayfasına yönlenmelidir. |
| C-010 | Kullanıcı deneyimi | Açıkça belgelenmiş | Kaynakla doğrulandı | DOC-A | Zorunlu alanlar etiket sonunda kırmızı "*" ile işaretlenir; form başında "* Zorunlu soruyu belirtir" açıklaması bulunur. |
| C-011 | Kullanıcı deneyimi | Açıkça belgelenmiş | Kaynakla doğrulandı | DOC-A | Çok sayfalı akış: ilk sayfada "Sonraki"; ara sayfalarda "Geri" ve "Sonraki"; son sayfada "Geri" ve "Gönder". İlerleme göstergesi "Sayfa X… |
| C-020 | İşlevsel | Açıkça belgelenmiş | Kaynakla doğrulandı | DOC-A | "Talebi Gönderen Personel" — zorunlu kısa metin; açıklama "Şirket mailiniz". |
| C-021 | İşlevsel | Açıkça belgelenmiş | Kaynakla doğrulandı | DOC-A, DOC-C | "Cari Türü" — tek seçimli (radyo) soru; mevcut formda zorunlu değil (yıldız yok) ve "Seçimi temizle" eylemi var. Mevcut seçenekler: Talen… |
| C-022 | İşlevsel | Açıkça belgelenmiş | Kaynakla doğrulandı | DOC-A | "Cari Hesap Adı" — zorunlu kısa metin; açıklama "Örnek: DOME MEDYA VE İLETİŞİM ANONİM ŞİRKETİ". |
| C-023 | İşlevsel | Açıkça belgelenmiş | Kaynakla doğrulandı | DOC-A | "Nickname" — zorunlu kısa metin; açıklama "Örnek: Dome İstanbul". |
| C-024 | İşlevsel | Açıkça belgelenmiş | Kaynakla doğrulandı | DOC-A | "Ülke" — zorunlu açılır liste; ekran görüntüsünde yalnızca "Türkiye" değeri görünüyor. |
| C-025 | İşlevsel | Açıkça belgelenmiş | Kaynakla doğrulandı | DOC-A | "İl ve İlçe" — zorunlu kısa metin (tek alan). |
| C-026 | İşlevsel | Açıkça belgelenmiş | Kaynakla doğrulandı | DOC-A | "Adres" — zorunlu kısa metin. |
| C-027 | İşlevsel | Açıkça belgelenmiş | Kaynakla doğrulandı | DOC-A | "Posta Kodu" — zorunlu kısa metin. |
| C-028 | İşlevsel | Açıkça belgelenmiş | Kaynakla doğrulandı | DOC-A | "Yetkili Adı Soyadı" — zorunlu kısa metin. |
| C-029 | İşlevsel | Açıkça belgelenmiş | Kaynakla doğrulandı | DOC-A | "Yetkili Telefon No" — zorunlu kısa metin. |
| C-030 | İşlevsel | Açıkça belgelenmiş | Kaynakla doğrulandı | DOC-A | "Yetkili Mail" — zorunlu kısa metin. |
| C-031 | İşlevsel | Açıkça belgelenmiş | Kaynakla doğrulandı | DOC-A | "Finans Mail" — zorunlu kısa metin. |
| C-032 | İşlevsel | Açıkça belgelenmiş | Kaynakla doğrulandı | DOC-A | "Finans Telefon No" — zorunlu kısa metin. |
| C-033 | İşlevsel | Açıkça belgelenmiş | Kaynakla doğrulandı | DOC-A, DOC-C | "IBAN (TRY)" — zorunlu kısa metin. |
| C-034 | İşlevsel | Açıkça belgelenmiş | Kaynakla doğrulandı | DOC-A, DOC-C | "IBAN (USD)" — isteğe bağlı kısa metin (yıldız yok). |
| C-035 | İşlevsel | Açıkça belgelenmiş | Kaynakla doğrulandı | DOC-A | "Şirket/Belge Türü" — zorunlu açılır liste; ekran görüntüsünde yalnızca seçili değer "Limited / Anonim Şirketi" görünüyor. |
| C-036 | İşlevsel | Açıkça belgelenmiş | Kaynakla doğrulandı | DOC-A, DOC-C | Sayfa 2/6 "Vergi Bilgileri - Vergi Numarası / TC Kimlik No": "Vergi Numarası / TC Kimlik No" — zorunlu kısa metin. |
| C-037 | Doğrulama | Açıkça belgelenmiş | Kaynakla doğrulandı | DOC-A | Sayfa 5/6 "İstisna Belgesi": "İstisna Belgesi" — zorunlu dosya yükleme; açıklama "Desteklenen 1 dosya yükleyebilirsiniz. En fazla 10 MB o… |
| C-038 | İşlevsel | Açıkça belgelenmiş | Kaynakla doğrulandı | DOC-A, DOC-C | Sayfa 6/6 "Vergi Bilgileri - Vergi Dairesi": "Vergi Dairesi" — zorunlu kısa metin. Bu sayfada "Gönder" düğmesi bulunur. |
| C-040 | İşlevsel | Güçlü çıkarım | Önerilen iyileştirme | DOC-C | IBAN alanlarının yanına bir PDF yükleme alanı eklenmesi önerisi: vergi levhası ve firmanın banka bilgisinin imzalı şekilde yüklenmesi için. |
| C-Q01 ⛔ | Çözümsüz / açık | Belirsiz | Açık soru | DOC-A | Form 6 sayfadan oluşuyor ancak 3/6 ve 4/6 sayfaları kaynak belgelerde yok. Bu sayfalarda hangi alanlar var ve hangi durumda gösteriliyor? |
| C-Q02 ⛔ | Çözümsüz / açık | Belirsiz | Açık soru | DOC-A | "Şirket/Belge Türü" açılır listesinin tam seçenek listesi nedir? Belgede yalnızca "Limited / Anonim Şirketi" görünüyor. |
| C-Q03 ⛔ | Çözümsüz / açık | Belirsiz | Açık soru | DOC-A | Sayfalar arası yönlendirme kuralları nelerdir? Özellikle "İstisna Belgesi" (5/6, zorunlu yükleme) hangi yanıtta istenir? Google Forms'tak… |
| C-Q04 ⛔ | Çözümsüz / açık | Belirsiz | Açık soru | DOC-C, DOC-A | Olası çelişki: DOCX "Yurtdışı Satıcı (Ajans)" ve "Yurtdışı Müşteri" kategorilerini ekliyor; mevcut formda ise Türkiye'ye özgü alanlar (Ve… |
| C-Q05 | Çözümsüz / açık | Belirsiz | Açık soru | DOC-C, DOC-A | İki branş arasında kategori listesi dışında başka fark var mı? Özellikle: (a) "Bana fatura kesilecek" branşında IBAN (TRY) zorunlu mu? (b… |
| C-Q06 | Çözümsüz / açık | Belirsiz | Açık soru | DOC-A, DOC-C | Belge çelişkisi: Formu kim dolduruyor? Giriş metni ve DOCX kategori notları karşı tarafa (tedarikçi/müşteri) hitap ediyor; "Talebi Gönder… |
| C-Q07 | Çözümsüz / açık | Belirsiz | Açık soru | DOC-C, DOC-A | Gizlilik politikası bağlantısının doğru adresi nedir? (Mevcut bağlantı boş sayfa açıyor.) |
| C-Q08 | Teknik | Belirsiz | Açık soru | DOC-A | Mevcut form Google Forms'ta, DOME alanında ve oturum açmış Google hesabıyla çalışıyor ("Dosyaları yükleyip bu formu gönderdiğinizde Googl… |
| C-Q09 ⛔ | Teknik | Belirsiz | Açık soru | DOC-A | Gönderim sonrası ne olur ve uygulama hangi platformda geliştirilecek? Yanıtlar ve yüklenen dosyalar nereye kaydedilir/iletilir (tablo, e-… |
| C-Q10 | Çözümsüz / açık | Belirsiz | Açık soru | DOC-C | DOCX'te "Vergi Numarası / TC Kimlik No" (Sayfa 2/6) ve "Vergi Dairesi" (Sayfa 6/6) ekran görüntüleri not olmadan yer alıyor. Bir değişikl… |
| C-Q11 | Çözümsüz / açık | Belirsiz | Açık soru | DOC-A, DOC-C | Fatura yönüne göre değişen kategori sorusu (Cari Türü) zorunlu mu olacak? Mevcut formda zorunlu değil. |
| C-Q12 | Çözümsüz / açık | Belirsiz | Açık soru | DOC-A | "İstisna Belgesi" için desteklenen dosya türleri nelerdir? Belgede "Desteklenen 1 dosya" deniyor ancak türler listelenmiyor. |
| C-P01 | Doğrulama | Belirsiz | Önerilen iyileştirme | ANALIZ | E-posta format doğrulaması: Talebi Gönderen Personel, Yetkili Mail, Finans Mail alanları geçerli e-posta biçiminde olmalı. |
| C-P02 | Doğrulama | Belirsiz | Önerilen iyileştirme | ANALIZ | Telefon format doğrulaması: yalnızca rakam, boşluk, "+", parantez ve tire; 10–15 rakam. |
| C-P03 | Doğrulama | Belirsiz | Önerilen iyileştirme | ANALIZ | Vergi Numarası / TC Kimlik No: yalnızca rakam; 10 hane (Vergi Kimlik No) veya 11 hane (TC Kimlik No). |
| C-P04 | Doğrulama | Belirsiz | Önerilen iyileştirme | ANALIZ | IBAN format doğrulaması (ISO 13616, mod-97 kontrolü; boşluklar yok sayılır) — IBAN (TRY) ve doluysa IBAN (USD). |
| C-P05 | Doğrulama | Belirsiz | Önerilen iyileştirme | ANALIZ | Posta Kodu: 5 haneli rakam (Türkiye formatı). |
| C-P06 | Kullanıcı deneyimi | Güçlü çıkarım | Önerilen iyileştirme | ANALIZ | Fatura yönü değiştirildiğinde, yeni branşta geçersiz kalan Cari Türü seçimi temizlenir ve kullanıcı bilgilendirilir. Diğer yanıtlar korunur. |
| C-P07 | Kullanıcı deneyimi | Belirsiz | Önerilen iyileştirme | ANALIZ | Gönderimden önce tüm yanıtların bölüm bölüm özetlendiği ve düzenlenebildiği bir "Gözden geçir" adımı. |
| C-P08 | Doğrulama | Belirsiz | Önerilen iyileştirme | ANALIZ | Yalnızca boşluk karakterlerinden oluşan yanıtlar boş sayılır (zorunlu alan kontrolünde). |
| C-P09 | Kullanıcı deneyimi | Belirsiz | Önerilen iyileştirme | ANALIZ | Prototip sunumu: "Sayfa 1/6" alanları belgedeki sırayla, görsel alt başlıklar altında gösterilir (Talep ve cari bilgileri · Adres bilgile… |

### Ayrıntılar

#### C-001

- **Kaynak belge:** BRIEF (Proje brifi (kullanıcı talimatı))
- **Kaynak bölüm/referans:** Proje brifi – Cari Form, Bölüm A
- **Açıklama:** Zorunlu ilk soru "Fatura mı keseceğim, bana fatura mı kesilecek?" diğer tüm alanlardan önce gösterilir. Seçenekler: "Fatura keseceğim" ve "Bana fatura kesilecek". Seçim, sonraki form deneyimini belirler.
- **Etkilenen form:** Cari Form
- **Tür:** İşlevsel
- **Güven:** Açıkça belgelenmiş
- **Başlangıç durumu:** Kaynakla doğrulandı
- **Uygulama etkisi:** Bu soru yanıtlanmadan diğer bölümlere geçilemez. Yön değiştiğinde koşullu alanlar (Cari Türü seçenekleri ve branşa özgü kararlar) güncellenir.
- **Açık sorular:** —
- **İlgili alanlar:** `faturaYonu`

#### C-002

- **Kaynak belge:** DOC-C (`CARI__AC_ILIS__FORMU-_O_RNEK_S_ABLON.docx`), DOC-A (`CARI__AC_ILIS__FORMU_MERGED.pdf`)
- **Kaynak bölüm/referans:** DOC-C P004–P012; mevcut seçenekler DOC-A Sayfa 1/6
- **Açıklama:** "Cari Türü" alanındaki "Marka" ve "Ajans" seçenekleri yerine fatura yönüne göre kategori kırılımı kullanılır. Fatura keseceğim → Genel Tedarikçi, Satıcı (Ajans), Yurtdışı Satıcı (Ajans), Talent / Influencer. Bana fatura kesilecek → Müşteri, Yurtdışı Müşteri.
- **Etkilenen form:** Cari Form
- **Tür:** İş kuralı
- **Güven:** Güçlü çıkarım
- **Başlangıç durumu:** Kaynakla doğrulandı
- **Uygulama etkisi:** Cari Türü seçenekleri branşa göre değişir; "Marka" ve "Ajans" kaldırılır. Branş değiştiğinde geçersiz kalan seçim temizlenmelidir (bkz. C-P06).
- **Açık sorular:** DOCX notu "kırılımlar olabilir" diyor; listenin nihai olduğu ve alan etiketinin "Cari Türü" olarak kalacağı teyit edilmeli.
- **İlgili alanlar:** `cariTuru`

#### C-003

- **Kaynak belge:** DOC-C (`CARI__AC_ILIS__FORMU-_O_RNEK_S_ABLON.docx`), BRIEF (Proje brifi (kullanıcı talimatı))
- **Kaynak bölüm/referans:** DOC-C P005 ve P010; Proje brifi
- **Açıklama:** Branş eşleşmesi: DOCX'teki "Fatura kesecekseniz…" listesi "Fatura keseceğim" branşına; "Size fatura keseceksek…" listesi "Bana fatura kesilecek" branşına karşılık gelir. Bu notlardaki cümleler kategori sorusunun yardım metni olarak kullanılır.
- **Etkilenen form:** Cari Form
- **Tür:** İş kuralı
- **Güven:** Güçlü çıkarım
- **Başlangıç durumu:** Kaynakla doğrulandı
- **Uygulama etkisi:** Eşleşme, notların formu dolduran karşı tarafa ("siz") hitap ettiği okumasına dayanır. Formu DOME personeli dolduruyorsa ifade yönü ters okunabilir (bkz. C-Q06).
- **Açık sorular:** —
- **İlgili alanlar:** `cariTuru`, `faturaYonu`

#### C-004

- **Kaynak belge:** DOC-A (`CARI__AC_ILIS__FORMU_MERGED.pdf`), DOC-C (`CARI__AC_ILIS__FORMU-_O_RNEK_S_ABLON.docx`)
- **Kaynak bölüm/referans:** DOC-A Sayfa 1/6 başlık; DOC-C görsel 1
- **Açıklama:** Form başlığı: "Cari Hesap Açılış Talep Formu".
- **Etkilenen form:** Cari Form
- **Tür:** İçerik
- **Güven:** Açıkça belgelenmiş
- **Başlangıç durumu:** Kaynakla doğrulandı
- **Uygulama etkisi:** —
- **Açık sorular:** —

#### C-005

- **Kaynak belge:** DOC-A (`CARI__AC_ILIS__FORMU_MERGED.pdf`), DOC-C (`CARI__AC_ILIS__FORMU-_O_RNEK_S_ABLON.docx`)
- **Kaynak bölüm/referans:** DOC-A Sayfa 1/6 başlık altı; DOC-C görsel 1
- **Açıklama:** Giriş metni birebir gösterilir: "Sistemimize tedarikçi veya müşteri olarak eklenmeniz ve faturalarınızın zamanında işleme alınabilmesi için bu formda gereken tüm bilgileri doğru şekilde doldurmanızı rica ederiz."
- **Etkilenen form:** Cari Form
- **Tür:** İçerik
- **Güven:** Açıkça belgelenmiş
- **Başlangıç durumu:** Kaynakla doğrulandı
- **Uygulama etkisi:** Metin formu dolduran karşı tarafa hitap eder (bkz. C-Q06).
- **Açık sorular:** —

#### C-006

- **Kaynak belge:** DOC-A (`CARI__AC_ILIS__FORMU_MERGED.pdf`), DOC-C (`CARI__AC_ILIS__FORMU-_O_RNEK_S_ABLON.docx`)
- **Kaynak bölüm/referans:** DOC-A Sayfa 1/6 "Fatura Süreçleri Hakkında Önemli Bilgilendirme"
- **Açıklama:** Bilgilendirme "PO Numarası Zorunluluğu" birebir gösterilir: "Tüm tedarikçi faturalarında "E" harfi ile başlayan geçerli bir Satın Alma Sipariş (PO) numarası bulunmalıdır. PO numarası içermeyen faturalar kabul edilmeyecek ve ödeme süreci başlatılmadan iade edilecektir."
- **Etkilenen form:** Cari Form
- **Tür:** İş kuralı
- **Güven:** Açıkça belgelenmiş
- **Başlangıç durumu:** Kaynakla doğrulandı
- **Uygulama etkisi:** Bu bir fatura süreci kuralı için bilgilendirmedir; form PO numarası toplamaz veya doğrulamaz. Metin "tedarikçi faturaları"na atıf yapar.
- **Açık sorular:** "Bana fatura kesilecek" branşında gösterilip gösterilmeyeceği: C-Q05.

#### C-007

- **Kaynak belge:** DOC-A (`CARI__AC_ILIS__FORMU_MERGED.pdf`), DOC-C (`CARI__AC_ILIS__FORMU-_O_RNEK_S_ABLON.docx`)
- **Kaynak bölüm/referans:** DOC-A Sayfa 1/6 "Fatura Süreçleri Hakkında Önemli Bilgilendirme"
- **Açıklama:** Bilgilendirme "Fatura Gönderimi" birebir gösterilir: "E-arşiv ve kağıt faturalarınızı lütfen PDF formatında ilgili e-posta adreslerimize iletiniz:" ve e-posta adresi finans@dome.istanbul (mailto bağlantısı).
- **Etkilenen form:** Cari Form
- **Tür:** İçerik
- **Güven:** Açıkça belgelenmiş
- **Başlangıç durumu:** Kaynakla doğrulandı
- **Uygulama etkisi:** Form e-posta göndermez; yalnızca bilgilendirir.
- **Açık sorular:** "Bana fatura kesilecek" branşında gösterilip gösterilmeyeceği: C-Q05.

#### C-008

- **Kaynak belge:** DOC-A (`CARI__AC_ILIS__FORMU_MERGED.pdf`), DOC-C (`CARI__AC_ILIS__FORMU-_O_RNEK_S_ABLON.docx`)
- **Kaynak bölüm/referans:** DOC-A Sayfa 1/6 başlık altı; DOC-C görsel 1
- **Açıklama:** Gizlilik onay metni gösterilir: "Bu formu doldurarak bu linkten ulaşabileceğiniz gizlilik politikamızı kabul etmiş sayılırsınız." İkinci kısım gizlilik politikasına bağlantıdır.
- **Etkilenen form:** Cari Form
- **Tür:** İçerik
- **Güven:** Açıkça belgelenmiş
- **Başlangıç durumu:** Kaynakla doğrulandı
- **Uygulama etkisi:** Bağlantı adresi belgelerde yok (C-Q07). Ayrı bir onay kutusu belgede yok; metin bilgilendirme olarak gösterilir.
- **Açık sorular:** —

#### C-009

- **Kaynak belge:** DOC-C (`CARI__AC_ILIS__FORMU-_O_RNEK_S_ABLON.docx`)
- **Kaynak bölüm/referans:** DOC-C P002
- **Açıklama:** Mevcut formda gizlilik politikası bağlantısı boş sayfa açıyor; bağlantı çalışan bir gizlilik politikası sayfasına yönlenmelidir.
- **Etkilenen form:** Cari Form
- **Tür:** İşlevsel
- **Güven:** Açıkça belgelenmiş
- **Başlangıç durumu:** Kaynakla doğrulandı
- **Uygulama etkisi:** Doğru adres bilinmiyor (C-Q07); adres yapılandırılabilir olmalı ve bilinmeden uydurulmamalı.
- **Açık sorular:** Not virgülle bitiyor; devamında başka bir istek olup olmadığı belirsiz.

#### C-010

- **Kaynak belge:** DOC-A (`CARI__AC_ILIS__FORMU_MERGED.pdf`)
- **Kaynak bölüm/referans:** DOC-A tüm sayfalar
- **Açıklama:** Zorunlu alanlar etiket sonunda kırmızı "*" ile işaretlenir; form başında "* Zorunlu soruyu belirtir" açıklaması bulunur.
- **Etkilenen form:** Cari Form
- **Tür:** Kullanıcı deneyimi
- **Güven:** Açıkça belgelenmiş
- **Başlangıç durumu:** Kaynakla doğrulandı
- **Uygulama etkisi:** Zorunlu alan boşken ilerleme/gönderim engellenmelidir. Cari belgelerinde hata metni görünmüyor; aynı platformun varsayılan metni "Bu, yanıtlanması zorunlu bir sorudur" (Talent ekran görüntüsünde görülen) prototipte kullanıldı.
- **Açık sorular:** —

#### C-011

- **Kaynak belge:** DOC-A (`CARI__AC_ILIS__FORMU_MERGED.pdf`)
- **Kaynak bölüm/referans:** DOC-A Sayfa 1/6, 2/6, 5/6, 6/6 alt kısım
- **Açıklama:** Çok sayfalı akış: ilk sayfada "Sonraki"; ara sayfalarda "Geri" ve "Sonraki"; son sayfada "Geri" ve "Gönder". İlerleme göstergesi "Sayfa X / 6". Her sayfada "Formu temizle" eylemi.
- **Etkilenen form:** Cari Form
- **Tür:** Kullanıcı deneyimi
- **Güven:** Açıkça belgelenmiş
- **Başlangıç durumu:** Kaynakla doğrulandı
- **Uygulama etkisi:** Yeni yapıda sayfa sayısı ilk soru ve eksik sayfalara göre değişebilir. Geri dönüldüğünde girilen değerlerin korunması beklenir (platform davranışı).
- **Açık sorular:** —

#### C-020

- **Kaynak belge:** DOC-A (`CARI__AC_ILIS__FORMU_MERGED.pdf`)
- **Kaynak bölüm/referans:** DOC-A Sayfa 1/6
- **Açıklama:** "Talebi Gönderen Personel" — zorunlu kısa metin; açıklama "Şirket mailiniz".
- **Etkilenen form:** Cari Form
- **Tür:** İşlevsel
- **Güven:** Açıkça belgelenmiş
- **Başlangıç durumu:** Kaynakla doğrulandı
- **Uygulama etkisi:** E-posta formatı belgede doğrulanmıyor (öneri: C-P01). "Personel" ifadesi formu doldurana dair belirsizlik yaratıyor (C-Q06).
- **Açık sorular:** —
- **İlgili alanlar:** `talepEden`

#### C-021

- **Kaynak belge:** DOC-A (`CARI__AC_ILIS__FORMU_MERGED.pdf`), DOC-C (`CARI__AC_ILIS__FORMU-_O_RNEK_S_ABLON.docx`)
- **Kaynak bölüm/referans:** DOC-A Sayfa 1/6; DOC-C görsel 2
- **Açıklama:** "Cari Türü" — tek seçimli (radyo) soru; mevcut formda zorunlu değil (yıldız yok) ve "Seçimi temizle" eylemi var. Mevcut seçenekler: Talent / Influencer, Marka, Ajans (C-002 ile değişir).
- **Etkilenen form:** Cari Form
- **Tür:** İşlevsel
- **Güven:** Açıkça belgelenmiş
- **Başlangıç durumu:** Kaynakla doğrulandı
- **Uygulama etkisi:** Seçenekler C-002'ye göre branşa bağlıdır. Zorunluluk: C-Q11.
- **Açık sorular:** —
- **İlgili alanlar:** `cariTuru`

#### C-022

- **Kaynak belge:** DOC-A (`CARI__AC_ILIS__FORMU_MERGED.pdf`)
- **Kaynak bölüm/referans:** DOC-A Sayfa 1/6
- **Açıklama:** "Cari Hesap Adı" — zorunlu kısa metin; açıklama "Örnek: DOME MEDYA VE İLETİŞİM ANONİM ŞİRKETİ".
- **Etkilenen form:** Cari Form
- **Tür:** İşlevsel
- **Güven:** Açıkça belgelenmiş
- **Başlangıç durumu:** Kaynakla doğrulandı
- **Uygulama etkisi:** —
- **Açık sorular:** —
- **İlgili alanlar:** `cariHesapAdi`

#### C-023

- **Kaynak belge:** DOC-A (`CARI__AC_ILIS__FORMU_MERGED.pdf`)
- **Kaynak bölüm/referans:** DOC-A Sayfa 1/6
- **Açıklama:** "Nickname" — zorunlu kısa metin; açıklama "Örnek: Dome İstanbul".
- **Etkilenen form:** Cari Form
- **Tür:** İşlevsel
- **Güven:** Açıkça belgelenmiş
- **Başlangıç durumu:** Kaynakla doğrulandı
- **Uygulama etkisi:** —
- **Açık sorular:** —
- **İlgili alanlar:** `nickname`

#### C-024

- **Kaynak belge:** DOC-A (`CARI__AC_ILIS__FORMU_MERGED.pdf`)
- **Kaynak bölüm/referans:** DOC-A Sayfa 1/6
- **Açıklama:** "Ülke" — zorunlu açılır liste; ekran görüntüsünde yalnızca "Türkiye" değeri görünüyor.
- **Etkilenen form:** Cari Form
- **Tür:** İşlevsel
- **Güven:** Açıkça belgelenmiş
- **Başlangıç durumu:** Kaynakla doğrulandı
- **Uygulama etkisi:** Tam ülke listesi belgede yok; prototipte "Diğer ülke" yalnızca yer tutucudur (C-Q04).
- **Açık sorular:** —
- **İlgili alanlar:** `ulke`

#### C-025

- **Kaynak belge:** DOC-A (`CARI__AC_ILIS__FORMU_MERGED.pdf`)
- **Kaynak bölüm/referans:** DOC-A Sayfa 1/6
- **Açıklama:** "İl ve İlçe" — zorunlu kısa metin (tek alan).
- **Etkilenen form:** Cari Form
- **Tür:** İşlevsel
- **Güven:** Açıkça belgelenmiş
- **Başlangıç durumu:** Kaynakla doğrulandı
- **Uygulama etkisi:** —
- **Açık sorular:** —
- **İlgili alanlar:** `ilIlce`

#### C-026

- **Kaynak belge:** DOC-A (`CARI__AC_ILIS__FORMU_MERGED.pdf`)
- **Kaynak bölüm/referans:** DOC-A Sayfa 1/6
- **Açıklama:** "Adres" — zorunlu kısa metin.
- **Etkilenen form:** Cari Form
- **Tür:** İşlevsel
- **Güven:** Açıkça belgelenmiş
- **Başlangıç durumu:** Kaynakla doğrulandı
- **Uygulama etkisi:** —
- **Açık sorular:** —
- **İlgili alanlar:** `adres`

#### C-027

- **Kaynak belge:** DOC-A (`CARI__AC_ILIS__FORMU_MERGED.pdf`)
- **Kaynak bölüm/referans:** DOC-A Sayfa 1/6
- **Açıklama:** "Posta Kodu" — zorunlu kısa metin.
- **Etkilenen form:** Cari Form
- **Tür:** İşlevsel
- **Güven:** Açıkça belgelenmiş
- **Başlangıç durumu:** Kaynakla doğrulandı
- **Uygulama etkisi:** Format belgede yok (öneri: C-P05).
- **Açık sorular:** —
- **İlgili alanlar:** `postaKodu`

#### C-028

- **Kaynak belge:** DOC-A (`CARI__AC_ILIS__FORMU_MERGED.pdf`)
- **Kaynak bölüm/referans:** DOC-A Sayfa 1/6
- **Açıklama:** "Yetkili Adı Soyadı" — zorunlu kısa metin.
- **Etkilenen form:** Cari Form
- **Tür:** İşlevsel
- **Güven:** Açıkça belgelenmiş
- **Başlangıç durumu:** Kaynakla doğrulandı
- **Uygulama etkisi:** —
- **Açık sorular:** —
- **İlgili alanlar:** `yetkiliAdSoyad`

#### C-029

- **Kaynak belge:** DOC-A (`CARI__AC_ILIS__FORMU_MERGED.pdf`)
- **Kaynak bölüm/referans:** DOC-A Sayfa 1/6
- **Açıklama:** "Yetkili Telefon No" — zorunlu kısa metin.
- **Etkilenen form:** Cari Form
- **Tür:** İşlevsel
- **Güven:** Açıkça belgelenmiş
- **Başlangıç durumu:** Kaynakla doğrulandı
- **Uygulama etkisi:** Format belgede yok (öneri: C-P02).
- **Açık sorular:** —
- **İlgili alanlar:** `yetkiliTelefon`

#### C-030

- **Kaynak belge:** DOC-A (`CARI__AC_ILIS__FORMU_MERGED.pdf`)
- **Kaynak bölüm/referans:** DOC-A Sayfa 1/6
- **Açıklama:** "Yetkili Mail" — zorunlu kısa metin.
- **Etkilenen form:** Cari Form
- **Tür:** İşlevsel
- **Güven:** Açıkça belgelenmiş
- **Başlangıç durumu:** Kaynakla doğrulandı
- **Uygulama etkisi:** Format belgede yok (öneri: C-P01).
- **Açık sorular:** —
- **İlgili alanlar:** `yetkiliMail`

#### C-031

- **Kaynak belge:** DOC-A (`CARI__AC_ILIS__FORMU_MERGED.pdf`)
- **Kaynak bölüm/referans:** DOC-A Sayfa 1/6
- **Açıklama:** "Finans Mail" — zorunlu kısa metin.
- **Etkilenen form:** Cari Form
- **Tür:** İşlevsel
- **Güven:** Açıkça belgelenmiş
- **Başlangıç durumu:** Kaynakla doğrulandı
- **Uygulama etkisi:** Format belgede yok (öneri: C-P01).
- **Açık sorular:** —
- **İlgili alanlar:** `finansMail`

#### C-032

- **Kaynak belge:** DOC-A (`CARI__AC_ILIS__FORMU_MERGED.pdf`)
- **Kaynak bölüm/referans:** DOC-A Sayfa 1/6
- **Açıklama:** "Finans Telefon No" — zorunlu kısa metin.
- **Etkilenen form:** Cari Form
- **Tür:** İşlevsel
- **Güven:** Açıkça belgelenmiş
- **Başlangıç durumu:** Kaynakla doğrulandı
- **Uygulama etkisi:** Format belgede yok (öneri: C-P02).
- **Açık sorular:** —
- **İlgili alanlar:** `finansTelefon`

#### C-033

- **Kaynak belge:** DOC-A (`CARI__AC_ILIS__FORMU_MERGED.pdf`), DOC-C (`CARI__AC_ILIS__FORMU-_O_RNEK_S_ABLON.docx`)
- **Kaynak bölüm/referans:** DOC-A Sayfa 1/6; DOC-C görsel 3
- **Açıklama:** "IBAN (TRY)" — zorunlu kısa metin.
- **Etkilenen form:** Cari Form
- **Tür:** İşlevsel
- **Güven:** Açıkça belgelenmiş
- **Başlangıç durumu:** Kaynakla doğrulandı
- **Uygulama etkisi:** Format belgede yok (öneri: C-P04). Müşteri branşındaki zorunluluğu: C-Q05.
- **Açık sorular:** —
- **İlgili alanlar:** `ibanTry`

#### C-034

- **Kaynak belge:** DOC-A (`CARI__AC_ILIS__FORMU_MERGED.pdf`), DOC-C (`CARI__AC_ILIS__FORMU-_O_RNEK_S_ABLON.docx`)
- **Kaynak bölüm/referans:** DOC-A Sayfa 1/6; DOC-C görsel 3
- **Açıklama:** "IBAN (USD)" — isteğe bağlı kısa metin (yıldız yok).
- **Etkilenen form:** Cari Form
- **Tür:** İşlevsel
- **Güven:** Açıkça belgelenmiş
- **Başlangıç durumu:** Kaynakla doğrulandı
- **Uygulama etkisi:** —
- **Açık sorular:** —
- **İlgili alanlar:** `ibanUsd`

#### C-035

- **Kaynak belge:** DOC-A (`CARI__AC_ILIS__FORMU_MERGED.pdf`)
- **Kaynak bölüm/referans:** DOC-A Sayfa 1/6
- **Açıklama:** "Şirket/Belge Türü" — zorunlu açılır liste; ekran görüntüsünde yalnızca seçili değer "Limited / Anonim Şirketi" görünüyor.
- **Etkilenen form:** Cari Form
- **Tür:** İşlevsel
- **Güven:** Açıkça belgelenmiş
- **Başlangıç durumu:** Kaynakla doğrulandı
- **Uygulama etkisi:** Diğer seçenekler ve bu seçimin sonraki sayfa yönlendirmesine etkisi bilinmiyor (C-Q02, C-Q03).
- **Açık sorular:** —
- **İlgili alanlar:** `sirketBelgeTuru`

#### C-036

- **Kaynak belge:** DOC-A (`CARI__AC_ILIS__FORMU_MERGED.pdf`), DOC-C (`CARI__AC_ILIS__FORMU-_O_RNEK_S_ABLON.docx`)
- **Kaynak bölüm/referans:** DOC-A Sayfa 2/6; DOC-C görsel 4
- **Açıklama:** Sayfa 2/6 "Vergi Bilgileri - Vergi Numarası / TC Kimlik No": "Vergi Numarası / TC Kimlik No" — zorunlu kısa metin.
- **Etkilenen form:** Cari Form
- **Tür:** İşlevsel
- **Güven:** Açıkça belgelenmiş
- **Başlangıç durumu:** Kaynakla doğrulandı
- **Uygulama etkisi:** Format belgede yok (öneri: C-P03).
- **Açık sorular:** —
- **İlgili alanlar:** `vergiNo`

#### C-037

- **Kaynak belge:** DOC-A (`CARI__AC_ILIS__FORMU_MERGED.pdf`)
- **Kaynak bölüm/referans:** DOC-A Sayfa 5/6
- **Açıklama:** Sayfa 5/6 "İstisna Belgesi": "İstisna Belgesi" — zorunlu dosya yükleme; açıklama "Desteklenen 1 dosya yükleyebilirsiniz. En fazla 10 MB olmalıdır."
- **Etkilenen form:** Cari Form
- **Tür:** Doğrulama
- **Güven:** Açıkça belgelenmiş
- **Başlangıç durumu:** Kaynakla doğrulandı
- **Uygulama etkisi:** En fazla 1 dosya, en fazla 10 MB. Desteklenen türler belgede yok (C-Q12). Sayfanın hangi koşulda gösterileceği bilinmiyor (C-Q03).
- **Açık sorular:** —
- **İlgili alanlar:** `istisnaBelgesi`

#### C-038

- **Kaynak belge:** DOC-A (`CARI__AC_ILIS__FORMU_MERGED.pdf`), DOC-C (`CARI__AC_ILIS__FORMU-_O_RNEK_S_ABLON.docx`)
- **Kaynak bölüm/referans:** DOC-A Sayfa 6/6; DOC-C görsel 5
- **Açıklama:** Sayfa 6/6 "Vergi Bilgileri - Vergi Dairesi": "Vergi Dairesi" — zorunlu kısa metin. Bu sayfada "Gönder" düğmesi bulunur.
- **Etkilenen form:** Cari Form
- **Tür:** İşlevsel
- **Güven:** Açıkça belgelenmiş
- **Başlangıç durumu:** Kaynakla doğrulandı
- **Uygulama etkisi:** —
- **Açık sorular:** —
- **İlgili alanlar:** `vergiDairesi`

#### C-040

- **Kaynak belge:** DOC-C (`CARI__AC_ILIS__FORMU-_O_RNEK_S_ABLON.docx`)
- **Kaynak bölüm/referans:** DOC-C P014
- **Açıklama:** IBAN alanlarının yanına bir PDF yükleme alanı eklenmesi önerisi: vergi levhası ve firmanın banka bilgisinin imzalı şekilde yüklenmesi için.
- **Etkilenen form:** Cari Form
- **Tür:** İşlevsel
- **Güven:** Güçlü çıkarım
- **Başlangıç durumu:** Önerilen iyileştirme
- **Uygulama etkisi:** Not "yapabiliriz" diyor; öneri niteliğinde. Onaylanırsa: dosya türü PDF.
- **Açık sorular:** Tek dosya mı (vergi levhası + banka bilgisi birlikte) yoksa iki ayrı yükleme mi? Zorunlu mu? Boyut sınırı? Her iki branşta mı? "İmzalı" şartı nasıl kontrol edilecek (yalnızca açıklama mı)?
- **İlgili alanlar:** `belgeYukleme`

#### C-Q01 · ENGELLEYİCİ

- **Kaynak belge:** DOC-A (`CARI__AC_ILIS__FORMU_MERGED.pdf`)
- **Kaynak bölüm/referans:** DOC-A sayfa göstergeleri (1/6, 2/6, 5/6, 6/6)
- **Açıklama:** Form 6 sayfadan oluşuyor ancak 3/6 ve 4/6 sayfaları kaynak belgelerde yok. Bu sayfalarda hangi alanlar var ve hangi durumda gösteriliyor?
- **Etkilenen form:** Cari Form
- **Tür:** Çözümsüz / açık
- **Güven:** Belirsiz
- **Başlangıç durumu:** Açık soru
- **Uygulama etkisi:** Bu sayfalar tanımlanmadan formun tam alan envanteri çıkarılamaz. Prototipte yer tutucu olarak gösterilir.
- **Açık sorular:** Sayfa 3/6 ve 4/6'nın ekran görüntüleri veya alan listesi.

#### C-Q02 · ENGELLEYİCİ

- **Kaynak belge:** DOC-A (`CARI__AC_ILIS__FORMU_MERGED.pdf`)
- **Kaynak bölüm/referans:** DOC-A Sayfa 1/6 "Şirket/Belge Türü"
- **Açıklama:** "Şirket/Belge Türü" açılır listesinin tam seçenek listesi nedir? Belgede yalnızca "Limited / Anonim Şirketi" görünüyor.
- **Etkilenen form:** Cari Form
- **Tür:** Çözümsüz / açık
- **Güven:** Belirsiz
- **Başlangıç durumu:** Açık soru
- **Uygulama etkisi:** Seçenek listesi olmadan alan doğru uygulanamaz; büyük olasılıkla sayfa yönlendirmesini de belirliyor (C-Q03).
- **Açık sorular:** Tam seçenek listesi ve her seçeneğin anlamı.
- **İlgili alanlar:** `sirketBelgeTuru`

#### C-Q03 · ENGELLEYİCİ

- **Kaynak belge:** DOC-A (`CARI__AC_ILIS__FORMU_MERGED.pdf`)
- **Kaynak bölüm/referans:** DOC-A Sayfa 2/6 → 5/6 → 6/6 akışı
- **Açıklama:** Sayfalar arası yönlendirme kuralları nelerdir? Özellikle "İstisna Belgesi" (5/6, zorunlu yükleme) hangi yanıtta istenir? Google Forms'taki "yanıta göre bölüme git" ayarları belgelerde görünmüyor.
- **Etkilenen form:** Cari Form
- **Tür:** Çözümsüz / açık
- **Güven:** Belirsiz
- **Başlangıç durumu:** Açık soru
- **Uygulama etkisi:** Koşul bilinmeden İstisna Belgesi sayfası herkese zorunlu tutulursa yanlış kullanıcılar engellenebilir. Prototipte test anahtarıyla simüle edilir.
- **Açık sorular:** Hangi Şirket/Belge Türü (veya başka yanıt) hangi sayfaya yönlendiriyor?
- **İlgili alanlar:** `istisnaBelgesi`, `sirketBelgeTuru`

#### C-Q04 · ENGELLEYİCİ · BELGE ÇELİŞKİSİ

- **Kaynak belge:** DOC-C (`CARI__AC_ILIS__FORMU-_O_RNEK_S_ABLON.docx`), DOC-A (`CARI__AC_ILIS__FORMU_MERGED.pdf`)
- **Kaynak bölüm/referans:** DOC-C P008, P012 (Yurtdışı kategorileri) ↔ DOC-A Sayfa 1/6, 2/6, 6/6 (Türkiye'ye özgü zorunlu alanlar)
- **Açıklama:** Olası çelişki: DOCX "Yurtdışı Satıcı (Ajans)" ve "Yurtdışı Müşteri" kategorilerini ekliyor; mevcut formda ise Türkiye'ye özgü alanlar (Vergi Numarası / TC Kimlik No, Vergi Dairesi, IBAN (TRY), Posta Kodu, İl ve İlçe) zorunlu ve Ülke listesinde yalnızca "Türkiye" görünüyor. Yurtdışı cariler için bu alanlar nasıl davranmalı? Ülke listesi nedir?
- **Etkilenen form:** Cari Form
- **Tür:** Çözümsüz / açık
- **Güven:** Belirsiz
- **Başlangıç durumu:** Açık soru
- **Uygulama etkisi:** Kural uydurulmamalı. Karar verilene kadar alanlar belgede olduğu gibi kalır ve belirsizlik işaretlenir.
- **Açık sorular:** Yurtdışı carilerde hangi alanlar zorunlu/opsiyonel/gizli? Yabancı vergi numarası nasıl alınır? Ülke listesinin kaynağı?
- **İlgili alanlar:** `ulke`, `cariTuru`, `vergiNo`, `vergiDairesi`, `ibanTry`, `postaKodu`, `ilIlce`

#### C-Q05

- **Kaynak belge:** DOC-C (`CARI__AC_ILIS__FORMU-_O_RNEK_S_ABLON.docx`), DOC-A (`CARI__AC_ILIS__FORMU_MERGED.pdf`)
- **Kaynak bölüm/referans:** DOC-C P004–P012 yalnızca kategori listesini ayırıyor; DOC-A bilgilendirme ve IBAN alanları
- **Açıklama:** İki branş arasında kategori listesi dışında başka fark var mı? Özellikle: (a) "Bana fatura kesilecek" branşında IBAN (TRY) zorunlu mu? (b) PO Numarası ve Fatura Gönderimi bilgilendirmesi bu branşta gösterilmeli mi? (c) İstisna Belgesi ve PDF yükleme hangi branşlarda geçerli?
- **Etkilenen form:** Cari Form
- **Tür:** Çözümsüz / açık
- **Güven:** Belirsiz
- **Başlangıç durumu:** Açık soru
- **Uygulama etkisi:** Karar verilene kadar iki branş, kategori listesi dışında aynı alanları kullanır; farklar uydurulmaz.
- **Açık sorular:** —
- **İlgili alanlar:** `ibanTry`, `istisnaBelgesi`, `belgeYukleme`

#### C-Q06 · BELGE ÇELİŞKİSİ

- **Kaynak belge:** DOC-A (`CARI__AC_ILIS__FORMU_MERGED.pdf`), DOC-C (`CARI__AC_ILIS__FORMU-_O_RNEK_S_ABLON.docx`)
- **Kaynak bölüm/referans:** DOC-A giriş metni ("Sistemimize … eklenmeniz") ↔ DOC-A "Talebi Gönderen Personel – Şirket mailiniz"
- **Açıklama:** Belge çelişkisi: Formu kim dolduruyor? Giriş metni ve DOCX kategori notları karşı tarafa (tedarikçi/müşteri) hitap ediyor; "Talebi Gönderen Personel — Şirket mailiniz" ise DOME personelinin doldurduğunu düşündürüyor.
- **Etkilenen form:** Cari Form
- **Tür:** Çözümsüz / açık
- **Güven:** Belirsiz
- **Başlangıç durumu:** Açık soru
- **Uygulama etkisi:** İlk sorunun bakış açısı ("Fatura keseceğim" kimin ağzından), metinlerin hitabı ve kimlik doğrulama ihtiyacı buna bağlı. Prototip DOCX notlarının hitabını (karşı taraf) esas alır.
- **Açık sorular:** Form dış tarafa mı gönderiliyor, yoksa personel karşı taraf adına mı dolduruyor?
- **İlgili alanlar:** `talepEden`, `faturaYonu`

#### C-Q07

- **Kaynak belge:** DOC-C (`CARI__AC_ILIS__FORMU-_O_RNEK_S_ABLON.docx`), DOC-A (`CARI__AC_ILIS__FORMU_MERGED.pdf`)
- **Kaynak bölüm/referans:** DOC-C P002; DOC-A Sayfa 1/6
- **Açıklama:** Gizlilik politikası bağlantısının doğru adresi nedir? (Mevcut bağlantı boş sayfa açıyor.)
- **Etkilenen form:** Cari Form
- **Tür:** Çözümsüz / açık
- **Güven:** Belirsiz
- **Başlangıç durumu:** Açık soru
- **Uygulama etkisi:** Adres bilinene kadar yapılandırılabilir yer tutucu kullanılmalı.
- **Açık sorular:** —

#### C-Q08

- **Kaynak belge:** DOC-A (`CARI__AC_ILIS__FORMU_MERGED.pdf`)
- **Kaynak bölüm/referans:** DOC-A tüm sayfalar (oturum açık hesap, "Bu form DOME alanında oluşturuldu")
- **Açıklama:** Mevcut form Google Forms'ta, DOME alanında ve oturum açmış Google hesabıyla çalışıyor ("Dosyaları yükleyip bu formu gönderdiğinizde Google hesabınızla ilişkilendirilen ad, e-posta adresi ve fotoğraf kaydedilir"). Yeni uygulamada kimlik doğrulama gerekecek mi?
- **Etkilenen form:** Cari Form
- **Tür:** Teknik
- **Güven:** Belirsiz
- **Başlangıç durumu:** Açık soru
- **Uygulama etkisi:** C-Q06 ile bağlantılı. Karar verilmeden kimlik doğrulama eklenmemeli/kaldırılmamalı.
- **Açık sorular:** —

#### C-Q09 · ENGELLEYİCİ

- **Kaynak belge:** DOC-A (`CARI__AC_ILIS__FORMU_MERGED.pdf`)
- **Kaynak bölüm/referans:** DOC-A Sayfa 6/6 "Gönder" (gönderim sonrası belgelenmemiş)
- **Açıklama:** Gönderim sonrası ne olur ve uygulama hangi platformda geliştirilecek? Yanıtlar ve yüklenen dosyalar nereye kaydedilir/iletilir (tablo, e-posta, muhasebe yazılımı)? Kime bildirim gider? Google Forms'ta mı kalınacak, özel bir uygulama mı yapılacak?
- **Etkilenen form:** Cari Form
- **Tür:** Teknik
- **Güven:** Belirsiz
- **Başlangıç durumu:** Açık soru
- **Uygulama etkisi:** Bu bilinmeden gerçek gönderim, depolama veya entegrasyon uygulanamaz.
- **Açık sorular:** —

#### C-Q10

- **Kaynak belge:** DOC-C (`CARI__AC_ILIS__FORMU-_O_RNEK_S_ABLON.docx`)
- **Kaynak bölüm/referans:** DOC-C görsel 4 ve 5 (P015–P016)
- **Açıklama:** DOCX'te "Vergi Numarası / TC Kimlik No" (Sayfa 2/6) ve "Vergi Dairesi" (Sayfa 6/6) ekran görüntüleri not olmadan yer alıyor. Bir değişiklik mi isteniyor (ör. iki vergi alanının aynı sayfada birleştirilmesi)?
- **Etkilenen form:** Cari Form
- **Tür:** Çözümsüz / açık
- **Güven:** Belirsiz
- **Başlangıç durumu:** Açık soru
- **Uygulama etkisi:** Değişiklik varsayılmaz; mevcut sayfa yapısı korunur.
- **Açık sorular:** —
- **İlgili alanlar:** `vergiNo`, `vergiDairesi`

#### C-Q11

- **Kaynak belge:** DOC-A (`CARI__AC_ILIS__FORMU_MERGED.pdf`), DOC-C (`CARI__AC_ILIS__FORMU-_O_RNEK_S_ABLON.docx`)
- **Kaynak bölüm/referans:** DOC-A Sayfa 1/6 "Cari Türü" (yıldız yok); DOC-C P005/P010 ("…birini seçin lütfen")
- **Açıklama:** Fatura yönüne göre değişen kategori sorusu (Cari Türü) zorunlu mu olacak? Mevcut formda zorunlu değil.
- **Etkilenen form:** Cari Form
- **Tür:** Çözümsüz / açık
- **Güven:** Belirsiz
- **Başlangıç durumu:** Açık soru
- **Uygulama etkisi:** Karar verilene kadar belgedeki gibi isteğe bağlı kalır.
- **Açık sorular:** —
- **İlgili alanlar:** `cariTuru`

#### C-Q12

- **Kaynak belge:** DOC-A (`CARI__AC_ILIS__FORMU_MERGED.pdf`)
- **Kaynak bölüm/referans:** DOC-A Sayfa 5/6
- **Açıklama:** "İstisna Belgesi" için desteklenen dosya türleri nelerdir? Belgede "Desteklenen 1 dosya" deniyor ancak türler listelenmiyor.
- **Etkilenen form:** Cari Form
- **Tür:** Çözümsüz / açık
- **Güven:** Belirsiz
- **Başlangıç durumu:** Açık soru
- **Uygulama etkisi:** Karar verilene kadar tür kısıtı uygulanmaz; yalnızca 1 dosya ve 10 MB sınırı uygulanır.
- **Açık sorular:** —
- **İlgili alanlar:** `istisnaBelgesi`

#### C-P01

- **Kaynak belge:** ANALIZ (Analist önerisi (kaynak belgelerde yok))
- **Kaynak bölüm/referans:** Belgede yok — alan adlarından çıkarım ("mail")
- **Açıklama:** E-posta format doğrulaması: Talebi Gönderen Personel, Yetkili Mail, Finans Mail alanları geçerli e-posta biçiminde olmalı.
- **Etkilenen form:** Cari Form
- **Tür:** Doğrulama
- **Güven:** Belirsiz
- **Başlangıç durumu:** Önerilen iyileştirme
- **Uygulama etkisi:** Öneri durumundayken prototipte yalnızca uyarı (engellemez). Onaylanırsa hata olur.
- **Açık sorular:** Talebi Gönderen Personel için şirket alan adı (ör. @dome.istanbul) zorunlu mu?
- **İlgili alanlar:** `talepEden`, `yetkiliMail`, `finansMail`

#### C-P02

- **Kaynak belge:** ANALIZ (Analist önerisi (kaynak belgelerde yok))
- **Kaynak bölüm/referans:** Belgede yok
- **Açıklama:** Telefon format doğrulaması: yalnızca rakam, boşluk, "+", parantez ve tire; 10–15 rakam.
- **Etkilenen form:** Cari Form
- **Tür:** Doğrulama
- **Güven:** Belirsiz
- **Başlangıç durumu:** Önerilen iyileştirme
- **Uygulama etkisi:** Öneri durumundayken yalnızca uyarı.
- **Açık sorular:** Yurtdışı numaralar kabul edilecek mi?
- **İlgili alanlar:** `yetkiliTelefon`, `finansTelefon`

#### C-P03

- **Kaynak belge:** ANALIZ (Analist önerisi (kaynak belgelerde yok))
- **Kaynak bölüm/referans:** Belgede yok — alan etiketinden çıkarım
- **Açıklama:** Vergi Numarası / TC Kimlik No: yalnızca rakam; 10 hane (Vergi Kimlik No) veya 11 hane (TC Kimlik No).
- **Etkilenen form:** Cari Form
- **Tür:** Doğrulama
- **Güven:** Belirsiz
- **Başlangıç durumu:** Önerilen iyileştirme
- **Uygulama etkisi:** Öneri durumundayken yalnızca uyarı. Algoritmik sağlama (checksum) önerilmiyor. Yurtdışı cariler için geçersiz olabilir (C-Q04).
- **Açık sorular:** —
- **İlgili alanlar:** `vergiNo`

#### C-P04

- **Kaynak belge:** ANALIZ (Analist önerisi (kaynak belgelerde yok))
- **Kaynak bölüm/referans:** Belgede yok
- **Açıklama:** IBAN format doğrulaması (ISO 13616, mod-97 kontrolü; boşluklar yok sayılır) — IBAN (TRY) ve doluysa IBAN (USD).
- **Etkilenen form:** Cari Form
- **Tür:** Doğrulama
- **Güven:** Belirsiz
- **Başlangıç durumu:** Önerilen iyileştirme
- **Uygulama etkisi:** Öneri durumundayken yalnızca uyarı.
- **Açık sorular:** IBAN (TRY) için "TR" ile başlama ve 26 karakter şartı da aranmalı mı?
- **İlgili alanlar:** `ibanTry`, `ibanUsd`

#### C-P05

- **Kaynak belge:** ANALIZ (Analist önerisi (kaynak belgelerde yok))
- **Kaynak bölüm/referans:** Belgede yok
- **Açıklama:** Posta Kodu: 5 haneli rakam (Türkiye formatı).
- **Etkilenen form:** Cari Form
- **Tür:** Doğrulama
- **Güven:** Belirsiz
- **Başlangıç durumu:** Önerilen iyileştirme
- **Uygulama etkisi:** Öneri durumundayken yalnızca uyarı. Yurtdışı adresler için geçersiz olabilir (C-Q04).
- **Açık sorular:** —
- **İlgili alanlar:** `postaKodu`

#### C-P06

- **Kaynak belge:** ANALIZ (Analist önerisi (kaynak belgelerde yok))
- **Kaynak bölüm/referans:** Belgede yok — C-002 sonucunda gerekli davranış
- **Açıklama:** Fatura yönü değiştirildiğinde, yeni branşta geçersiz kalan Cari Türü seçimi temizlenir ve kullanıcı bilgilendirilir. Diğer yanıtlar korunur.
- **Etkilenen form:** Cari Form
- **Tür:** Kullanıcı deneyimi
- **Güven:** Güçlü çıkarım
- **Başlangıç durumu:** Önerilen iyileştirme
- **Uygulama etkisi:** Prototip bu davranışı uygular.
- **Açık sorular:** —
- **İlgili alanlar:** `faturaYonu`, `cariTuru`

#### C-P07

- **Kaynak belge:** ANALIZ (Analist önerisi (kaynak belgelerde yok))
- **Kaynak bölüm/referans:** Belgede yok
- **Açıklama:** Gönderimden önce tüm yanıtların bölüm bölüm özetlendiği ve düzenlenebildiği bir "Gözden geçir" adımı.
- **Etkilenen form:** Cari Form
- **Tür:** Kullanıcı deneyimi
- **Güven:** Belirsiz
- **Başlangıç durumu:** Önerilen iyileştirme
- **Uygulama etkisi:** Google Forms'ta bu adım yok. Prototip bu adımı içerir.
- **Açık sorular:** —

#### C-P08

- **Kaynak belge:** ANALIZ (Analist önerisi (kaynak belgelerde yok))
- **Kaynak bölüm/referans:** Belgede yok
- **Açıklama:** Yalnızca boşluk karakterlerinden oluşan yanıtlar boş sayılır (zorunlu alan kontrolünde).
- **Etkilenen form:** Cari Form
- **Tür:** Doğrulama
- **Güven:** Belirsiz
- **Başlangıç durumu:** Önerilen iyileştirme
- **Uygulama etkisi:** Prototip bu davranışı uygular.
- **Açık sorular:** —

#### C-P09

- **Kaynak belge:** ANALIZ (Analist önerisi (kaynak belgelerde yok))
- **Kaynak bölüm/referans:** Belgede yok — prototipte test edilen sunum
- **Açıklama:** Prototip sunumu: "Sayfa 1/6" alanları belgedeki sırayla, görsel alt başlıklar altında gösterilir (Talep ve cari bilgileri · Adres bilgileri · Yetkili ve finans iletişim bilgileri · Banka bilgileri · Şirket / belge türü). Her alanın altında açıklama metni, hatada alanın altında kırmızı mesaj ve sayfa üstünde hata özeti gösterilir; ilk hatalı alana odaklanılır.
- **Etkilenen form:** Cari Form
- **Tür:** Kullanıcı deneyimi
- **Güven:** Belirsiz
- **Başlangıç durumu:** Önerilen iyileştirme
- **Uygulama etkisi:** Alan sırası ve metinler değişmez; yalnızca görsel gruplama ve hata sunumu eklenir.
- **Açık sorular:** —

## Yeni Talent Form (24 madde)

| Kimlik | Tür | Güven | Başlangıç durumu | Kaynak | Özet |
|---|---|---|---|---|---|
| T-001 | İçerik | Açıkça belgelenmiş | Kaynakla doğrulandı | DOC-B | Form başlığı: "Yeni Talent Formu". |
| T-002 | Kullanıcı deneyimi | Açıkça belgelenmiş | Kaynakla doğrulandı | DOC-B | Form tek sayfadır ve alanlar belgede görünen sırayla gösterilir. Sayfa sonunda "Gönder" düğmesi ve "Formu temizle" eylemi bulunur. |
| T-003 | Doğrulama | Açıkça belgelenmiş | Kaynakla doğrulandı | DOC-B | Zorunlu alanlar kırmızı "*" ile işaretlenir ("* Zorunlu soruyu belirtir"). Zorunlu alan boş gönderilirse alan kırmızı çerçeveyle vurgulan… |
| T-010 | İşlevsel | Açıkça belgelenmiş | Kaynakla doğrulandı | DOC-B | "Talebi Gönderen Kişi Mail" — zorunlu kısa metin; yer tutucu "Yanıtınız". |
| T-011 | İşlevsel | Açıkça belgelenmiş | Kaynakla doğrulandı | DOC-B | "Talent İsim Soyisim" — zorunlu kısa metin; açıklama "Örnek: Berk Keklik". |
| T-012 | İşlevsel | Açıkça belgelenmiş | Kaynakla doğrulandı | DOC-B | "Bir ajansa bağlı mı?" — zorunlu tek seçim (radyo): "Evet, Dome / TEM", "Evet, Diğer.", "Hayır". |
| T-013 | Doğrulama | Açıkça belgelenmiş | Kaynakla doğrulandı | DOC-B | "Fotoğraf" — zorunlu dosya yükleme; açıklama "Desteklenen 1 dosya yükleyebilirsiniz: image. En fazla 10 MB olmalıdır." |
| T-014 | İşlevsel | Açıkça belgelenmiş | Kaynakla doğrulandı | DOC-B | "Talent Nickname" — zorunlu kısa metin; açıklama "Örnek: Uberkuloz". |
| T-015 | İşlevsel | Açıkça belgelenmiş | Kaynakla doğrulandı | DOC-B | "Kategori" — zorunlu açılır liste (varsayılan "Seçin"): Lifestyle, Entertainment, Technology, Gaming, Sports, Other. |
| T-016 | İş kuralı | Açıkça belgelenmiş | Kaynakla doğrulandı | DOC-B | "Cari Adı" — zorunlu kısa metin; açıklama "Eğer carisi sistemde kayıtlı değilse cari formu da doldurulmalıdır." |
| T-017 | İşlevsel | Açıkça belgelenmiş | Kaynakla doğrulandı | DOC-B | "Belge Tipi" — zorunlu açılır liste (varsayılan "Seçin"): E-Fatura, E-Arşiv, Gider Pusulası, Serbest Meslek Makbuzu, İstisna Belgesi. |
| T-018 | İşlevsel | Açıkça belgelenmiş | Kaynakla doğrulandı | DOC-B | "Instagram Link", "YouTube Link", "TikTok Link", "Twitch Link" — dördü de isteğe bağlı kısa metin (yıldız yok); yer tutucu "Yanıtınız". |
| T-Q01 | Çözümsüz / açık | Belirsiz | Açık soru | DOC-B | "Bir ajansa bağlı mı?" sorusunda "Evet, Diğer." seçildiğinde ajans adı sorulmalı mı? |
| T-Q02 | Çözümsüz / açık | Belirsiz | Açık soru | DOC-B | Kategori "Other" seçildiğinde açıklama alanı istenmeli mi? |
| T-Q03 | Çözümsüz / açık | Belirsiz | Açık soru | DOC-B | "Cari Adı" serbest metin mi kalacak, yoksa kayıtlı cariler listesinden mi seçilecek? Carinin "sistemde kayıtlı" olup olmadığı nasıl kontr… |
| T-Q04 | Çözümsüz / açık | Belirsiz | Açık soru | DOC-B | Sosyal medya linklerinden en az birinin doldurulması zorunlu mu? |
| T-Q05 | Çözümsüz / açık | Belirsiz | Açık soru | DOC-B | Fotoğraf için hangi görsel biçimleri kabul edilecek (JPG, PNG, HEIC, WEBP…)? Fotoğraf nerede saklanacak ve ne için kullanılacak? |
| T-Q06 ⛔ | Teknik | Belirsiz | Açık soru | DOC-B | Gönderim sonrası ne olur ve uygulama hangi platformda geliştirilecek? Yanıtlar ve fotoğraf nereye kaydedilir/iletilir? Kime bildirim gide… |
| T-Q07 | Teknik | Belirsiz | Açık soru | DOC-B | Mevcut form DOME alanında, oturum açmış Google hesabıyla çalışıyor ve ayrıca "Talebi Gönderen Kişi Mail" soruluyor. Formu yalnızca DOME p… |
| T-P01 | Doğrulama | Belirsiz | Önerilen iyileştirme | ANALIZ | E-posta format doğrulaması: "Talebi Gönderen Kişi Mail" geçerli e-posta biçiminde olmalı. |
| T-P02 | Doğrulama | Belirsiz | Önerilen iyileştirme | ANALIZ | Link alanları doluysa "http://" veya "https://" ile başlayan geçerli bir URL olmalı. |
| T-P03 | Doğrulama | Belirsiz | Önerilen iyileştirme | ANALIZ | Yalnızca boşluk karakterlerinden oluşan yanıtlar boş sayılır (zorunlu alan kontrolünde). |
| T-P04 | Kullanıcı deneyimi | Belirsiz | Önerilen iyileştirme | ANALIZ | Gönderimden önce tüm yanıtların özetlendiği ve düzenlenebildiği bir "Gözden geçir" adımı. |
| T-P05 | Kullanıcı deneyimi | Belirsiz | Önerilen iyileştirme | ANALIZ | Prototip sunumu: alanlar belgedeki sırayla, görsel alt başlıklar altında gösterilir (Talep sahibi · Talent bilgileri · Cari ve belge bilg… |

### Ayrıntılar

#### T-001

- **Kaynak belge:** DOC-B (`Yeni_Talent_Formu_MERGED.pdf`)
- **Kaynak bölüm/referans:** Başlık
- **Açıklama:** Form başlığı: "Yeni Talent Formu".
- **Etkilenen form:** Yeni Talent Form
- **Tür:** İçerik
- **Güven:** Açıkça belgelenmiş
- **Başlangıç durumu:** Kaynakla doğrulandı
- **Uygulama etkisi:** —
- **Açık sorular:** —

#### T-002

- **Kaynak belge:** DOC-B (`Yeni_Talent_Formu_MERGED.pdf`)
- **Kaynak bölüm/referans:** Tüm sayfa; alt kısım
- **Açıklama:** Form tek sayfadır ve alanlar belgede görünen sırayla gösterilir. Sayfa sonunda "Gönder" düğmesi ve "Formu temizle" eylemi bulunur.
- **Etkilenen form:** Yeni Talent Form
- **Tür:** Kullanıcı deneyimi
- **Güven:** Açıkça belgelenmiş
- **Başlangıç durumu:** Kaynakla doğrulandı
- **Uygulama etkisi:** Çok adımlı akış belgede yok.
- **Açık sorular:** —

#### T-003

- **Kaynak belge:** DOC-B (`Yeni_Talent_Formu_MERGED.pdf`)
- **Kaynak bölüm/referans:** Üst kısım; Kategori ve Belge Tipi hata durumu
- **Açıklama:** Zorunlu alanlar kırmızı "*" ile işaretlenir ("* Zorunlu soruyu belirtir"). Zorunlu alan boş gönderilirse alan kırmızı çerçeveyle vurgulanır ve altında "Bu, yanıtlanması zorunlu bir sorudur" mesajı gösterilir.
- **Etkilenen form:** Yeni Talent Form
- **Tür:** Doğrulama
- **Güven:** Açıkça belgelenmiş
- **Başlangıç durumu:** Kaynakla doğrulandı
- **Uygulama etkisi:** Hata metni birebir kullanılmalı.
- **Açık sorular:** —

#### T-010

- **Kaynak belge:** DOC-B (`Yeni_Talent_Formu_MERGED.pdf`)
- **Kaynak bölüm/referans:** Alan 1
- **Açıklama:** "Talebi Gönderen Kişi Mail" — zorunlu kısa metin; yer tutucu "Yanıtınız".
- **Etkilenen form:** Yeni Talent Form
- **Tür:** İşlevsel
- **Güven:** Açıkça belgelenmiş
- **Başlangıç durumu:** Kaynakla doğrulandı
- **Uygulama etkisi:** Format belgede yok (öneri: T-P01).
- **Açık sorular:** —
- **İlgili alanlar:** `talepEdenMail`

#### T-011

- **Kaynak belge:** DOC-B (`Yeni_Talent_Formu_MERGED.pdf`)
- **Kaynak bölüm/referans:** Alan 2
- **Açıklama:** "Talent İsim Soyisim" — zorunlu kısa metin; açıklama "Örnek: Berk Keklik".
- **Etkilenen form:** Yeni Talent Form
- **Tür:** İşlevsel
- **Güven:** Açıkça belgelenmiş
- **Başlangıç durumu:** Kaynakla doğrulandı
- **Uygulama etkisi:** —
- **Açık sorular:** —
- **İlgili alanlar:** `talentIsimSoyisim`

#### T-012

- **Kaynak belge:** DOC-B (`Yeni_Talent_Formu_MERGED.pdf`)
- **Kaynak bölüm/referans:** Alan 3
- **Açıklama:** "Bir ajansa bağlı mı?" — zorunlu tek seçim (radyo): "Evet, Dome / TEM", "Evet, Diğer.", "Hayır".
- **Etkilenen form:** Yeni Talent Form
- **Tür:** İşlevsel
- **Güven:** Açıkça belgelenmiş
- **Başlangıç durumu:** Kaynakla doğrulandı
- **Uygulama etkisi:** Seçenek metinleri birebir korunur ("Evet, Diğer." noktayla). Koşullu ek alan yok (T-Q01).
- **Açık sorular:** —
- **İlgili alanlar:** `ajansBagli`

#### T-013

- **Kaynak belge:** DOC-B (`Yeni_Talent_Formu_MERGED.pdf`)
- **Kaynak bölüm/referans:** Alan 4
- **Açıklama:** "Fotoğraf" — zorunlu dosya yükleme; açıklama "Desteklenen 1 dosya yükleyebilirsiniz: image. En fazla 10 MB olmalıdır."
- **Etkilenen form:** Yeni Talent Form
- **Tür:** Doğrulama
- **Güven:** Açıkça belgelenmiş
- **Başlangıç durumu:** Kaynakla doğrulandı
- **Uygulama etkisi:** En fazla 1 dosya, yalnızca görsel, en fazla 10 MB.
- **Açık sorular:** —
- **İlgili alanlar:** `fotograf`

#### T-014

- **Kaynak belge:** DOC-B (`Yeni_Talent_Formu_MERGED.pdf`)
- **Kaynak bölüm/referans:** Alan 5
- **Açıklama:** "Talent Nickname" — zorunlu kısa metin; açıklama "Örnek: Uberkuloz".
- **Etkilenen form:** Yeni Talent Form
- **Tür:** İşlevsel
- **Güven:** Açıkça belgelenmiş
- **Başlangıç durumu:** Kaynakla doğrulandı
- **Uygulama etkisi:** —
- **Açık sorular:** —
- **İlgili alanlar:** `talentNickname`

#### T-015

- **Kaynak belge:** DOC-B (`Yeni_Talent_Formu_MERGED.pdf`)
- **Kaynak bölüm/referans:** Alan 6; kırmızı not "Kategori – Seçenekler"
- **Açıklama:** "Kategori" — zorunlu açılır liste (varsayılan "Seçin"): Lifestyle, Entertainment, Technology, Gaming, Sports, Other.
- **Etkilenen form:** Yeni Talent Form
- **Tür:** İşlevsel
- **Güven:** Açıkça belgelenmiş
- **Başlangıç durumu:** Kaynakla doğrulandı
- **Uygulama etkisi:** Seçenekler İngilizce ve bu sırayla korunur. Koşullu ek alan yok (T-Q02).
- **Açık sorular:** —
- **İlgili alanlar:** `kategori`

#### T-016

- **Kaynak belge:** DOC-B (`Yeni_Talent_Formu_MERGED.pdf`)
- **Kaynak bölüm/referans:** Alan 7
- **Açıklama:** "Cari Adı" — zorunlu kısa metin; açıklama "Eğer carisi sistemde kayıtlı değilse cari formu da doldurulmalıdır."
- **Etkilenen form:** Yeni Talent Form
- **Tür:** İş kuralı
- **Güven:** Açıkça belgelenmiş
- **Başlangıç durumu:** Kaynakla doğrulandı
- **Uygulama etkisi:** Açıklama, ayrı bir Cari Hesap Açılış Talep Formu'na yönlendirir (S-001). Kontrol mekanizması belgede yok (T-Q03).
- **Açık sorular:** —
- **İlgili alanlar:** `cariAdi`

#### T-017

- **Kaynak belge:** DOC-B (`Yeni_Talent_Formu_MERGED.pdf`)
- **Kaynak bölüm/referans:** Alan 8; kırmızı not "Belge Tipi – Seçenekler"
- **Açıklama:** "Belge Tipi" — zorunlu açılır liste (varsayılan "Seçin"): E-Fatura, E-Arşiv, Gider Pusulası, Serbest Meslek Makbuzu, İstisna Belgesi.
- **Etkilenen form:** Yeni Talent Form
- **Tür:** İşlevsel
- **Güven:** Açıkça belgelenmiş
- **Başlangıç durumu:** Kaynakla doğrulandı
- **Uygulama etkisi:** Seçeneklere bağlı koşullu davranış belgede yok (S-002).
- **Açık sorular:** —
- **İlgili alanlar:** `belgeTipi`

#### T-018

- **Kaynak belge:** DOC-B (`Yeni_Talent_Formu_MERGED.pdf`)
- **Kaynak bölüm/referans:** Alan 9–12
- **Açıklama:** "Instagram Link", "YouTube Link", "TikTok Link", "Twitch Link" — dördü de isteğe bağlı kısa metin (yıldız yok); yer tutucu "Yanıtınız".
- **Etkilenen form:** Yeni Talent Form
- **Tür:** İşlevsel
- **Güven:** Açıkça belgelenmiş
- **Başlangıç durumu:** Kaynakla doğrulandı
- **Uygulama etkisi:** Format belgede yok (öneri: T-P02). En az bir link şartı yok (T-Q04).
- **Açık sorular:** —
- **İlgili alanlar:** `instagram`, `youtube`, `tiktok`, `twitch`

#### T-Q01

- **Kaynak belge:** DOC-B (`Yeni_Talent_Formu_MERGED.pdf`)
- **Kaynak bölüm/referans:** Alan 3
- **Açıklama:** "Bir ajansa bağlı mı?" sorusunda "Evet, Diğer." seçildiğinde ajans adı sorulmalı mı?
- **Etkilenen form:** Yeni Talent Form
- **Tür:** Çözümsüz / açık
- **Güven:** Belirsiz
- **Başlangıç durumu:** Açık soru
- **Uygulama etkisi:** Karar verilene kadar ek alan eklenmez.
- **Açık sorular:** —
- **İlgili alanlar:** `ajansBagli`

#### T-Q02

- **Kaynak belge:** DOC-B (`Yeni_Talent_Formu_MERGED.pdf`)
- **Kaynak bölüm/referans:** Alan 6
- **Açıklama:** Kategori "Other" seçildiğinde açıklama alanı istenmeli mi?
- **Etkilenen form:** Yeni Talent Form
- **Tür:** Çözümsüz / açık
- **Güven:** Belirsiz
- **Başlangıç durumu:** Açık soru
- **Uygulama etkisi:** Karar verilene kadar ek alan eklenmez.
- **Açık sorular:** —
- **İlgili alanlar:** `kategori`

#### T-Q03

- **Kaynak belge:** DOC-B (`Yeni_Talent_Formu_MERGED.pdf`)
- **Kaynak bölüm/referans:** Alan 7
- **Açıklama:** "Cari Adı" serbest metin mi kalacak, yoksa kayıtlı cariler listesinden mi seçilecek? Carinin "sistemde kayıtlı" olup olmadığı nasıl kontrol edilecek? Formda Cari Hesap Açılış Talep Formu'na bağlantı verilecek mi (adresi nedir)?
- **Etkilenen form:** Yeni Talent Form
- **Tür:** Çözümsüz / açık
- **Güven:** Belirsiz
- **Başlangıç durumu:** Açık soru
- **Uygulama etkisi:** Karar verilene kadar serbest metin ve açıklama metni olarak kalır; otomatik kontrol uydurulmaz.
- **Açık sorular:** —
- **İlgili alanlar:** `cariAdi`

#### T-Q04

- **Kaynak belge:** DOC-B (`Yeni_Talent_Formu_MERGED.pdf`)
- **Kaynak bölüm/referans:** Alan 9–12
- **Açıklama:** Sosyal medya linklerinden en az birinin doldurulması zorunlu mu?
- **Etkilenen form:** Yeni Talent Form
- **Tür:** Çözümsüz / açık
- **Güven:** Belirsiz
- **Başlangıç durumu:** Açık soru
- **Uygulama etkisi:** Karar verilene kadar dördü de tamamen isteğe bağlıdır.
- **Açık sorular:** —
- **İlgili alanlar:** `instagram`, `youtube`, `tiktok`, `twitch`

#### T-Q05

- **Kaynak belge:** DOC-B (`Yeni_Talent_Formu_MERGED.pdf`)
- **Kaynak bölüm/referans:** Alan 4
- **Açıklama:** Fotoğraf için hangi görsel biçimleri kabul edilecek (JPG, PNG, HEIC, WEBP…)? Fotoğraf nerede saklanacak ve ne için kullanılacak?
- **Etkilenen form:** Yeni Talent Form
- **Tür:** Çözümsüz / açık
- **Güven:** Belirsiz
- **Başlangıç durumu:** Açık soru
- **Uygulama etkisi:** Karar verilene kadar "image/*" kabul edilir.
- **Açık sorular:** —
- **İlgili alanlar:** `fotograf`

#### T-Q06 · ENGELLEYİCİ

- **Kaynak belge:** DOC-B (`Yeni_Talent_Formu_MERGED.pdf`)
- **Kaynak bölüm/referans:** "Gönder" (gönderim sonrası belgelenmemiş)
- **Açıklama:** Gönderim sonrası ne olur ve uygulama hangi platformda geliştirilecek? Yanıtlar ve fotoğraf nereye kaydedilir/iletilir? Kime bildirim gider? Google Forms'ta mı kalınacak, özel bir uygulama mı yapılacak?
- **Etkilenen form:** Yeni Talent Form
- **Tür:** Teknik
- **Güven:** Belirsiz
- **Başlangıç durumu:** Açık soru
- **Uygulama etkisi:** Bu bilinmeden gerçek gönderim, depolama veya entegrasyon uygulanamaz.
- **Açık sorular:** —

#### T-Q07

- **Kaynak belge:** DOC-B (`Yeni_Talent_Formu_MERGED.pdf`)
- **Kaynak bölüm/referans:** Üst kısım (oturum açık hesap, "Bu form DOME alanında oluşturuldu")
- **Açıklama:** Mevcut form DOME alanında, oturum açmış Google hesabıyla çalışıyor ve ayrıca "Talebi Gönderen Kişi Mail" soruluyor. Formu yalnızca DOME personeli mi dolduracak? Yeni uygulamada kimlik doğrulama gerekecek mi; e-posta oturumdan otomatik alınabilir mi?
- **Etkilenen form:** Yeni Talent Form
- **Tür:** Teknik
- **Güven:** Belirsiz
- **Başlangıç durumu:** Açık soru
- **Uygulama etkisi:** Karar verilene kadar e-posta alanı elle doldurulur; kimlik doğrulama eklenmez.
- **Açık sorular:** —
- **İlgili alanlar:** `talepEdenMail`

#### T-P01

- **Kaynak belge:** ANALIZ (Analist önerisi (kaynak belgelerde yok))
- **Kaynak bölüm/referans:** Belgede yok — alan adından çıkarım ("Mail")
- **Açıklama:** E-posta format doğrulaması: "Talebi Gönderen Kişi Mail" geçerli e-posta biçiminde olmalı.
- **Etkilenen form:** Yeni Talent Form
- **Tür:** Doğrulama
- **Güven:** Belirsiz
- **Başlangıç durumu:** Önerilen iyileştirme
- **Uygulama etkisi:** Öneri durumundayken prototipte yalnızca uyarı (engellemez). Onaylanırsa hata olur.
- **Açık sorular:** Şirket alan adı (ör. @dome.istanbul) zorunlu mu?
- **İlgili alanlar:** `talepEdenMail`

#### T-P02

- **Kaynak belge:** ANALIZ (Analist önerisi (kaynak belgelerde yok))
- **Kaynak bölüm/referans:** Belgede yok
- **Açıklama:** Link alanları doluysa "http://" veya "https://" ile başlayan geçerli bir URL olmalı.
- **Etkilenen form:** Yeni Talent Form
- **Tür:** Doğrulama
- **Güven:** Belirsiz
- **Başlangıç durumu:** Önerilen iyileştirme
- **Uygulama etkisi:** Öneri durumundayken yalnızca uyarı. Platform alan adı eşleşmesi (instagram.com vb.) önerilmiyor; kısa linkler (youtu.be) nedeniyle yanlış red riski var.
- **Açık sorular:** —
- **İlgili alanlar:** `instagram`, `youtube`, `tiktok`, `twitch`

#### T-P03

- **Kaynak belge:** ANALIZ (Analist önerisi (kaynak belgelerde yok))
- **Kaynak bölüm/referans:** Belgede yok
- **Açıklama:** Yalnızca boşluk karakterlerinden oluşan yanıtlar boş sayılır (zorunlu alan kontrolünde).
- **Etkilenen form:** Yeni Talent Form
- **Tür:** Doğrulama
- **Güven:** Belirsiz
- **Başlangıç durumu:** Önerilen iyileştirme
- **Uygulama etkisi:** Prototip bu davranışı uygular.
- **Açık sorular:** —

#### T-P04

- **Kaynak belge:** ANALIZ (Analist önerisi (kaynak belgelerde yok))
- **Kaynak bölüm/referans:** Belgede yok
- **Açıklama:** Gönderimden önce tüm yanıtların özetlendiği ve düzenlenebildiği bir "Gözden geçir" adımı.
- **Etkilenen form:** Yeni Talent Form
- **Tür:** Kullanıcı deneyimi
- **Güven:** Belirsiz
- **Başlangıç durumu:** Önerilen iyileştirme
- **Uygulama etkisi:** Google Forms'ta bu adım yok. Prototip bu adımı içerir.
- **Açık sorular:** —

#### T-P05

- **Kaynak belge:** ANALIZ (Analist önerisi (kaynak belgelerde yok))
- **Kaynak bölüm/referans:** Belgede yok — prototipte test edilen sunum
- **Açıklama:** Prototip sunumu: alanlar belgedeki sırayla, görsel alt başlıklar altında gösterilir (Talep sahibi · Talent bilgileri · Cari ve belge bilgileri · Sosyal medya hesapları). Hatada alanın altında kırmızı mesaj ve form üstünde hata özeti gösterilir; ilk hatalı alana odaklanılır.
- **Etkilenen form:** Yeni Talent Form
- **Tür:** Kullanıcı deneyimi
- **Güven:** Belirsiz
- **Başlangıç durumu:** Önerilen iyileştirme
- **Uygulama etkisi:** Alan sırası ve metinler değişmez; yalnızca görsel gruplama ve hata sunumu eklenir.
- **Açık sorular:** —

## Her iki form (ortak) (3 madde)

| Kimlik | Tür | Güven | Başlangıç durumu | Kaynak | Özet |
|---|---|---|---|---|---|
| S-001 | İş kuralı | Açıkça belgelenmiş | Kaynakla doğrulandı | DOC-B | Yeni Talent Formu, talentin carisi sistemde kayıtlı değilse ayrı "Cari Hesap Açılış Talep Formu"nun da doldurulmasını şart koşar ("Eğer c… |
| S-002 | Çözümsüz / açık | Belirsiz | Açık soru | DOC-A, DOC-B | "İstisna Belgesi" iki formda da geçiyor: Cari Hesap Açılış Talep Formu'nda zorunlu dosya yükleme sayfası olarak; Yeni Talent Formu'nda "B… |
| S-003 | Çözümsüz / açık | Belirsiz | Açık soru | DOC-A, DOC-C, DOC-B | Cari formundaki "Talent / Influencer" kategorisi ile ayrı Yeni Talent Formu arasındaki ilişki belgelenmemiş (ör. bu kategori seçildiğinde… |

### Ayrıntılar

#### S-001

- **Kaynak belge:** DOC-B (`Yeni_Talent_Formu_MERGED.pdf`)
- **Kaynak bölüm/referans:** DOC-B Alan 7 "Cari Adı" açıklaması
- **Açıklama:** Yeni Talent Formu, talentin carisi sistemde kayıtlı değilse ayrı "Cari Hesap Açılış Talep Formu"nun da doldurulmasını şart koşar ("Eğer carisi sistemde kayıtlı değilse cari formu da doldurulmalıdır.").
- **Etkilenen form:** Her iki form — Cari etkisi: Bu formun yapısını değiştirmez; formun sistemde kayıtlı olmayan talent carileri için de doldurulduğunu gösterir. Yeni Talent Formu ile otomatik bağlantı, kontrol veya veri aktarımı kurma. / Talent etkisi: "Cari Adı" alanının açıklaması olarak birebir korunur. Cari Hesap Açılış Talep Formu ayrı bir sistemdir; otomatik kontrol veya bağımlılık kurma (kontrol mekanizması açık soru: T-Q03).
- **Tür:** İş kuralı
- **Güven:** Açıkça belgelenmiş
- **Başlangıç durumu:** Kaynakla doğrulandı
- **Uygulama etkisi:** —
- **Açık sorular:** —

#### S-002

- **Kaynak belge:** DOC-A (`CARI__AC_ILIS__FORMU_MERGED.pdf`), DOC-B (`Yeni_Talent_Formu_MERGED.pdf`)
- **Kaynak bölüm/referans:** DOC-A Sayfa 5/6 "İstisna Belgesi" (zorunlu yükleme) ↔ DOC-B Alan 8 "Belge Tipi" seçeneği "İstisna Belgesi"
- **Açıklama:** "İstisna Belgesi" iki formda da geçiyor: Cari Hesap Açılış Talep Formu'nda zorunlu dosya yükleme sayfası olarak; Yeni Talent Formu'nda "Belge Tipi" seçeneği olarak. İki kullanım arasındaki ilişki (ör. Talent formunda bu seçenek seçilince belge yüklemesi istenmesi) belgelenmemiş.
- **Etkilenen form:** Her iki form — Cari etkisi: Karar verilene kadar iki form birbirinden bağımsız davranır; ek yükleme alanı veya formlar arası kural eklenmez. / Talent etkisi: Karar verilene kadar iki form birbirinden bağımsız davranır; ek yükleme alanı veya formlar arası kural eklenmez.
- **Tür:** Çözümsüz / açık
- **Güven:** Belirsiz
- **Başlangıç durumu:** Açık soru
- **Uygulama etkisi:** —
- **Açık sorular:** —

#### S-003

- **Kaynak belge:** DOC-A (`CARI__AC_ILIS__FORMU_MERGED.pdf`), DOC-C (`CARI__AC_ILIS__FORMU-_O_RNEK_S_ABLON.docx`), DOC-B (`Yeni_Talent_Formu_MERGED.pdf`)
- **Kaynak bölüm/referans:** DOC-A/DOC-C "Cari Türü" seçeneği "Talent / Influencer" ↔ DOC-B Yeni Talent Formu
- **Açıklama:** Cari formundaki "Talent / Influencer" kategorisi ile ayrı Yeni Talent Formu arasındaki ilişki belgelenmemiş (ör. bu kategori seçildiğinde Yeni Talent Formu'nun da doldurulması gerekir mi?).
- **Etkilenen form:** Her iki form — Cari etkisi: Karar verilene kadar formlar arası yönlendirme veya bağımlılık eklenmez. / Talent etkisi: Karar verilene kadar formlar arası yönlendirme veya bağımlılık eklenmez.
- **Tür:** Çözümsüz / açık
- **Güven:** Belirsiz
- **Başlangıç durumu:** Açık soru
- **Uygulama etkisi:** —
- **Açık sorular:** —

