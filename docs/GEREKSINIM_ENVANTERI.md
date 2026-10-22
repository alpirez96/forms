# Gereksinim Envanteri

> Bu dosya `npm run docs` ile `src/data/` altındaki verilerden otomatik üretilir; elle düzenlemeyin. Uygulamadaki "Gereksinimler ve açık sorular" ekranı aynı veriyi gösterir.

Durumlar başlangıç (inceleme öncesi) durumlarıdır. Testte verdiğiniz kararlar uygulamada saklanır ve JSON dışa aktarımına girer.

## Kaynak belgeler

| Kimlik | Belge | Dosya | İçerik |
|---|---|---|---|
| DOC-A | Cari Hesap Açılış Talep Formu – birleştirilmiş ekran görüntüleri (PDF) | CARI__AC_ILIS__FORMU_MERGED.pdf | Google Forms üzerindeki mevcut "Cari Hesap Açılış Talep Formu"nun 5 PDF sayfalık ekran görüntüsü. PDF sayfa 1–2 = form sayfası 1/6, PDF sayfa 3 = 2/6, PDF sayfa 4 = 5/6, PDF sayfa 5 = 6/6. Form sayfaları 3/6 ve 4/6 belgede yer almıyor (DOC-D ile tamamlandı). Alanlara test amaçlı değerler girilmiş; bu değerler gereksinim değildir. |
| DOC-D | Cari Hesap Açılış Talep Formu – canlı formun kaydedilmiş sayfası (HTML, 2026-10-22) | Cari_Hesap_Ac__l_s__Talep_Formu.html | Google Forms görüntüleme sayfasının tarayıcıdan kaydedilmiş hâli. Ekranda yalnızca ilk sayfa görünür; ancak sayfaya gömülü form tanımı (FB_PUBLIC_LOAD_DATA_) tüm 6 bölümü, soruları, seçenekleri, zorunlulukları, uzunluk doğrulamalarını, yanıta göre bölüm yönlendirmelerini, gönderim sonrası onay mesajını ve açıklamadaki bağlantı adreslerini içerir. Dosya yükleme ayarları (tür/boyut) tanımda yer almaz. Dosyada kullanıcının kayıtlı taslak yanıtları bulunduğu için depoya eklenmedi ve bu yanıtlar okunmadı. |
| DOC-B | Yeni Talent Formu – ekran görüntüsü ve seçenek notları (PDF) | Yeni_Talent_Formu_MERGED.pdf | Google Forms üzerindeki "Yeni Talent Formu"nun tek sayfalık ekran görüntüsü. Sağ tarafta kırmızı oklarla "Kategori – Seçenekler" ve "Belge Tipi – Seçenekler" açılır listeleri gösterilmiş. |
| DOC-C | Cari Açılış Formu – Örnek Şablon (DOCX, değişiklik notları) | CARI__AC_ILIS__FORMU-_O_RNEK_S_ABLON.docx | Cari formunun 5 ekran görüntüsü ve aralarında kırmızı-kalın yazılmış değişiklik notları (P002, P004–P012, P014). Word yorumu veya izlenen değişiklik içermez. Notlar muhasebe ekibinin form tasarımına yönelik değişiklik talepleridir. |
| BRIEF | Proje brifi (kullanıcı talimatı) | — | Bu prototipi isteyen proje brifi. Cari Form için ilk sorunun "Fatura mı keseceğim, bana fatura mı kesilecek?" olmasını ve iki seçeneğin "Fatura keseceğim" / "Bana fatura kesilecek" olmasını zorunlu kılar. |
| ANALIZ | Analist önerisi (kaynak belgelerde yok) | — | Belgelerde tanımlı olmayan, yalnızca öneri olarak sunulan maddeler. Onaylanmadıkça gereksinim sayılmaz. |

Güven düzeyleri: **Açıkça belgelenmiş** (belgede birebir görünür) · **Güçlü çıkarım** (belgeden doğrudan çıkarılır ama ifade kesin değil) · **Belirsiz** (belge yanıt vermiyor).

## Cari Form (59 madde)

| Kimlik | Tür | Güven | Başlangıç durumu | Kaynak | Özet |
|---|---|---|---|---|---|
| C-001 | İşlevsel | Açıkça belgelenmiş | Kaynakla doğrulandı | BRIEF | Zorunlu ilk soru "Fatura mı keseceğim, bana fatura mı kesilecek?" diğer tüm alanlardan önce gösterilir. Seçenekler: "Fatura keseceğim" ve… |
| C-002 | İş kuralı | Güçlü çıkarım | Kaynakla doğrulandı | DOC-C, DOC-A, DOC-D | "Cari Türü" alanındaki "Marka" ve "Ajans" seçenekleri yerine fatura yönüne göre kategori kırılımı kullanılır. Fatura keseceğim → Genel Te… |
| C-003 | İş kuralı | Güçlü çıkarım | Kaynakla doğrulandı | DOC-C, BRIEF | Branş eşleşmesi: DOCX'teki "Fatura kesecekseniz…" listesi "Fatura keseceğim" branşına; "Size fatura keseceksek…" listesi "Bana fatura kes… |
| C-004 | İçerik | Açıkça belgelenmiş | Kaynakla doğrulandı | DOC-A, DOC-C, DOC-D | Form başlığı: "Cari Hesap Açılış Talep Formu". |
| C-005 | İçerik | Açıkça belgelenmiş | Kaynakla doğrulandı | DOC-A, DOC-C, DOC-D | Giriş metni birebir gösterilir: "Sistemimize tedarikçi veya müşteri olarak eklenmeniz ve faturalarınızın zamanında işleme alınabilmesi iç… |
| C-006 | İş kuralı | Açıkça belgelenmiş | Kaynakla doğrulandı | DOC-A, DOC-C, DOC-D | Bilgilendirme "PO Numarası Zorunluluğu" birebir gösterilir: "Tüm tedarikçi faturalarında "E" harfi ile başlayan geçerli bir Satın Alma Si… |
| C-007 | İçerik | Açıkça belgelenmiş | Kaynakla doğrulandı | DOC-A, DOC-C, DOC-D | Bilgilendirme "Fatura Gönderimi" birebir gösterilir: "E-arşiv ve kağıt faturalarınızı lütfen PDF formatında ilgili e-posta adreslerimize … |
| C-008 | İçerik | Açıkça belgelenmiş | Kaynakla doğrulandı | DOC-A, DOC-C, DOC-D | Gizlilik onay metni gösterilir: "Bu formu doldurarak bu linkten ulaşabileceğiniz gizlilik politikamızı kabul etmiş sayılırsınız." İkinci … |
| C-009 | İşlevsel | Açıkça belgelenmiş | Kaynakla doğrulandı | DOC-C, DOC-D | Mevcut formda gizlilik politikası bağlantısı (https://dome.istanbul/privacy-policy) boş sayfa açıyor; bağlantı çalışan bir gizlilik polit… |
| C-010 | Kullanıcı deneyimi | Açıkça belgelenmiş | Kaynakla doğrulandı | DOC-A | Zorunlu alanlar etiket sonunda kırmızı "*" ile işaretlenir; form başında "* Zorunlu soruyu belirtir" açıklaması bulunur. |
| C-011 | Kullanıcı deneyimi | Açıkça belgelenmiş | Kaynakla doğrulandı | DOC-A, DOC-D | Çok sayfalı akış: ilk sayfada "Sonraki"; ara sayfalarda "Geri" ve "Sonraki"; yolun son sayfasında "Geri" ve "Gönder". İlerleme göstergesi… |
| C-020 | İşlevsel | Açıkça belgelenmiş | Kaynakla doğrulandı | DOC-A, DOC-D | "Talebi Gönderen Personel" — zorunlu kısa metin; açıklama "Şirket mailiniz". |
| C-021 | İşlevsel | Açıkça belgelenmiş | Kaynakla doğrulandı | DOC-A, DOC-C, DOC-D | "Cari Türü" — tek seçimli (radyo) soru; mevcut formda zorunlu değil (yıldız yok) ve "Seçimi temizle" eylemi var. Mevcut seçenekler: Talen… |
| C-022 | İşlevsel | Açıkça belgelenmiş | Kaynakla doğrulandı | DOC-A | "Cari Hesap Adı" — zorunlu kısa metin; açıklama "Örnek: DOME MEDYA VE İLETİŞİM ANONİM ŞİRKETİ". |
| C-023 | İşlevsel | Açıkça belgelenmiş | Kaynakla doğrulandı | DOC-A | "Nickname" — zorunlu kısa metin; açıklama "Örnek: Dome İstanbul". |
| C-024 | İşlevsel | Açıkça belgelenmiş | Kaynakla doğrulandı | DOC-D, DOC-A | "Ülke" — zorunlu açılır liste. Seçenekler (bu sırayla): Türkiye, Amerika Birleşik Devletleri, Birleşik Krallık, Çin, Diğer. |
| C-025 | İşlevsel | Açıkça belgelenmiş | Kaynakla doğrulandı | DOC-D, DOC-A | "İl ve İlçe" — zorunlu uzun metin (paragraf) sorusu; tek alan. |
| C-026 | İşlevsel | Açıkça belgelenmiş | Kaynakla doğrulandı | DOC-D, DOC-A | "Adres" — zorunlu uzun metin (paragraf) sorusu. |
| C-027 | İşlevsel | Açıkça belgelenmiş | Kaynakla doğrulandı | DOC-A | "Posta Kodu" — zorunlu kısa metin. |
| C-028 | İşlevsel | Açıkça belgelenmiş | Kaynakla doğrulandı | DOC-A | "Yetkili Adı Soyadı" — zorunlu kısa metin. |
| C-029 | İşlevsel | Açıkça belgelenmiş | Kaynakla doğrulandı | DOC-A | "Yetkili Telefon No" — zorunlu kısa metin. |
| C-030 | İşlevsel | Açıkça belgelenmiş | Kaynakla doğrulandı | DOC-A | "Yetkili Mail" — zorunlu kısa metin. |
| C-031 | İşlevsel | Açıkça belgelenmiş | Kaynakla doğrulandı | DOC-A | "Finans Mail" — zorunlu kısa metin. |
| C-032 | İşlevsel | Açıkça belgelenmiş | Kaynakla doğrulandı | DOC-A | "Finans Telefon No" — zorunlu kısa metin. |
| C-033 | İşlevsel | Açıkça belgelenmiş | Kaynakla doğrulandı | DOC-A, DOC-C | "IBAN (TRY)" — zorunlu kısa metin. |
| C-034 | İşlevsel | Açıkça belgelenmiş | Kaynakla doğrulandı | DOC-A, DOC-C | "IBAN (USD)" — isteğe bağlı kısa metin (yıldız yok). |
| C-035 | İşlevsel | Açıkça belgelenmiş | Kaynakla doğrulandı | DOC-D, DOC-A | "Şirket/Belge Türü" — zorunlu açılır liste. Seçenekler (bu sırayla): Limited / Anonim Şirketi, Şahıs Firması, İstisna Belgesi, Serbest Me… |
| C-036 | Doğrulama | Açıkça belgelenmiş | Kaynakla doğrulandı | DOC-A, DOC-C, DOC-D | Sayfa 2/6 "Vergi Bilgileri - Vergi Numarası / TC Kimlik No": "Vergi Numarası / TC Kimlik No" — zorunlu kısa metin; en fazla 15 karakter. |
| C-037 | Doğrulama | Açıkça belgelenmiş | Kaynakla doğrulandı | DOC-A, DOC-D | Sayfa 5/6 "İstisna Belgesi": "İstisna Belgesi" — zorunlu dosya yükleme; açıklama "Desteklenen 1 dosya yükleyebilirsiniz. En fazla 10 MB o… |
| C-038 | İşlevsel | Açıkça belgelenmiş | Kaynakla doğrulandı | DOC-A, DOC-C, DOC-D | "Vergi Bilgileri - Vergi Dairesi" sayfası: "Vergi Dairesi" — zorunlu kısa metin. Canlı formda bu sayfa 4/6'dır (DOC-A'da 6/6) ve ardından… |
| C-040 | İşlevsel | Güçlü çıkarım | Önerilen iyileştirme | DOC-C | IBAN alanlarının yanına bir PDF yükleme alanı eklenmesi önerisi: vergi levhası ve firmanın banka bilgisinin imzalı şekilde yüklenmesi için. |
| C-041 | İş kuralı | Açıkça belgelenmiş | Kaynakla doğrulandı | DOC-D | Yanıta göre yönlendirme: Limited / Anonim Şirketi → Sayfa 2/6 "Vergi Bilgileri - Vergi Numarası / TC Kimlik No"; Şahıs Firması → Sayfa 2/… |
| C-042 | İş kuralı | Güçlü çıkarım | Kaynakla doğrulandı | DOC-D | Tam yollar: (1) Limited / Anonim Şirketi, Şahıs Firması: Sayfa 1/6 → 2/6 Vergi Numarası / TC Kimlik No → 4/6 Vergi Dairesi → Gönder (3/6 … |
| C-043 | Doğrulama | Açıkça belgelenmiş | Kaynakla doğrulandı | DOC-D | Sayfa 3/6 "TC Kimlik No": "TC Kimlik No" — zorunlu kısa metin; en fazla 11 karakter. |
| C-044 | İçerik | Açıkça belgelenmiş | Kaynakla doğrulandı | DOC-D | Gönderimden sonra gösterilen onay mesajı: "Teşekkürler. Cari Talebiniz Alınmıştır." |
| C-045 | Teknik | Güçlü çıkarım | Kaynakla doğrulandı | DOC-D | Canlı formun 6. bölümü "Submit" başlıklı ve soru içermeyen teknik bir bölümdür; "İstisna Belgesi" sayfasından sonra "TC Kimlik No" sayfas… |
| C-Q01 ⛔ | İşlevsel | Açıkça belgelenmiş | Kaynakla doğrulandı | DOC-D, DOC-A | Cevaplandı (DOC-D): DOC-A'da görünmeyen sayfalar canlı formda Sayfa 3/6 "TC Kimlik No" ve Sayfa 4/6 "Vergi Bilgileri - Vergi Dairesi"dir;… |
| C-Q02 ⛔ | İşlevsel | Açıkça belgelenmiş | Kaynakla doğrulandı | DOC-D, DOC-A | Cevaplandı (DOC-D): "Şirket/Belge Türü" seçenekleri Limited / Anonim Şirketi, Şahıs Firması, İstisna Belgesi, Serbest Meslek Makbuzu, Gid… |
| C-Q03 ⛔ | İşlevsel | Güçlü çıkarım | Kaynakla doğrulandı | DOC-D | Cevaplandı (DOC-D): "İstisna Belgesi" sayfası yalnızca Şirket/Belge Türü = İstisna Belgesi seçildiğinde açılır ve ardından "TC Kimlik No"… |
| C-Q04 | Çözümsüz / açık | Belirsiz | Açık soru | DOC-C, DOC-D | Yurtdışı cariler için alanlar nasıl davranmalı? DOCX "Yurtdışı Satıcı (Ajans)" ve "Yurtdışı Müşteri" kategorilerini ekliyor. Canlı formda… |
| C-Q05 | Çözümsüz / açık | Belirsiz | Açık soru | DOC-C, DOC-A, DOC-D | İki branş arasında kategori listesi dışında başka fark var mı? Özellikle: (a) "Bana fatura kesilecek" branşında IBAN (TRY) zorunlu mu? (b… |
| C-Q06 | Çözümsüz / açık | Belirsiz | Açık soru | DOC-A, DOC-C | Belge çelişkisi: Formu kim dolduruyor? Giriş metni ve DOCX kategori notları karşı tarafa (tedarikçi/müşteri) hitap ediyor; "Talebi Gönder… |
| C-Q07 | Çözümsüz / açık | Belirsiz | Açık soru | DOC-C, DOC-D | Gizlilik politikası bağlantısı nasıl düzeltilecek? Canlı formdaki adres https://dome.istanbul/privacy-policy; DOCX'e göre bu bağlantı boş… |
| C-Q08 | Teknik | Belirsiz | Açık soru | DOC-A, DOC-D | Mevcut form Google Forms'ta, DOME alanında ve oturum açmış Google hesabıyla çalışıyor ("Dosyaları yükleyip bu formu gönderdiğinizde Googl… |
| C-Q09 ⛔ | Teknik | Belirsiz | Açık soru | DOC-A, DOC-D | Gönderim sonrası ne olur ve uygulama hangi platformda geliştirilecek? Yanıtlar ve yüklenen dosyalar nereye kaydedilir/iletilir (tablo, e-… |
| C-Q10 | Çözümsüz / açık | Belirsiz | Açık soru | DOC-C | DOCX'te "Vergi Numarası / TC Kimlik No" (Sayfa 2/6) ve "Vergi Dairesi" (Sayfa 6/6) ekran görüntüleri not olmadan yer alıyor. Bir değişikl… |
| C-Q11 | Çözümsüz / açık | Belirsiz | Açık soru | DOC-A, DOC-C, DOC-D | Fatura yönüne göre değişen kategori sorusu (Cari Türü) zorunlu mu olacak? Mevcut formda zorunlu değil. |
| C-Q12 | Çözümsüz / açık | Belirsiz | Açık soru | DOC-A, DOC-D | "İstisna Belgesi" için desteklenen dosya türleri nelerdir? Belgede "Desteklenen 1 dosya" deniyor ancak türler listelenmiyor. |
| C-Q13 | Çözümsüz / açık | Belirsiz | Açık soru | DOC-A, DOC-D | Belge çelişkisi (sürüm farkı): DOC-A ekran görüntülerinde "Vergi Bilgileri - Vergi Dairesi" sayfası "Sayfa 6/6", canlı formda (DOC-D) ise… |
| C-P01 | Doğrulama | Belirsiz | Önerilen iyileştirme | ANALIZ | E-posta format doğrulaması: Talebi Gönderen Personel, Yetkili Mail, Finans Mail alanları geçerli e-posta biçiminde olmalı. |
| C-P02 | Doğrulama | Belirsiz | Önerilen iyileştirme | ANALIZ | Telefon format doğrulaması: yalnızca rakam, boşluk, "+", parantez ve tire; 10–15 rakam. |
| C-P03 | Doğrulama | Belirsiz | Önerilen iyileştirme | ANALIZ | Vergi Numarası / TC Kimlik No: yalnızca rakam; 10 hane (Vergi Kimlik No) veya 11 hane (TC Kimlik No). |
| C-P04 | Doğrulama | Belirsiz | Önerilen iyileştirme | ANALIZ | IBAN format doğrulaması (ISO 13616, mod-97 kontrolü; boşluklar yok sayılır) — IBAN (TRY) ve doluysa IBAN (USD). |
| C-P05 | Doğrulama | Belirsiz | Önerilen iyileştirme | ANALIZ | Posta Kodu: 5 haneli rakam (Türkiye formatı). |
| C-P06 | Kullanıcı deneyimi | Güçlü çıkarım | Önerilen iyileştirme | ANALIZ | Fatura yönü değiştirildiğinde, yeni branşta geçersiz kalan Cari Türü seçimi temizlenir ve kullanıcı bilgilendirilir. Diğer yanıtlar korunur. |
| C-P07 | Kullanıcı deneyimi | Belirsiz | Önerilen iyileştirme | ANALIZ | Gönderimden önce tüm yanıtların bölüm bölüm özetlendiği ve düzenlenebildiği bir "Gözden geçir" adımı. |
| C-P08 | Doğrulama | Belirsiz | Önerilen iyileştirme | ANALIZ | Yalnızca boşluk karakterlerinden oluşan yanıtlar boş sayılır (zorunlu alan kontrolünde). |
| C-P09 | Kullanıcı deneyimi | Belirsiz | Önerilen iyileştirme | ANALIZ | Prototip sunumu: "Sayfa 1/6" alanları belgedeki sırayla, görsel alt başlıklar altında gösterilir (Talep ve cari bilgileri · Adres bilgile… |
| C-P10 | Doğrulama | Belirsiz | Önerilen iyileştirme | ANALIZ | TC Kimlik No: tam 11 hane, yalnızca rakam. |

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

- **Kaynak belge:** DOC-C (`CARI__AC_ILIS__FORMU-_O_RNEK_S_ABLON.docx`), DOC-A (`CARI__AC_ILIS__FORMU_MERGED.pdf`), DOC-D (`Cari_Hesap_Ac__l_s__Talep_Formu.html`)
- **Kaynak bölüm/referans:** DOC-C P004–P012; mevcut seçenekler DOC-A Sayfa 1/6 ve DOC-D
- **Açıklama:** "Cari Türü" alanındaki "Marka" ve "Ajans" seçenekleri yerine fatura yönüne göre kategori kırılımı kullanılır. Fatura keseceğim → Genel Tedarikçi, Satıcı (Ajans), Yurtdışı Satıcı (Ajans), Talent / Influencer. Bana fatura kesilecek → Müşteri, Yurtdışı Müşteri.
- **Etkilenen form:** Cari Form
- **Tür:** İş kuralı
- **Güven:** Güçlü çıkarım
- **Başlangıç durumu:** Kaynakla doğrulandı
- **Uygulama etkisi:** Cari Türü seçenekleri branşa göre değişir; "Marka" ve "Ajans" kaldırılır. Branş değiştiğinde geçersiz kalan seçim temizlenmelidir (bkz. C-P06). Canlı form (DOC-D) hâlâ eski seçenekleri (Talent / Influencer, Marka, Ajans) kullanıyor; değişiklik henüz uygulanmamış.
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

- **Kaynak belge:** DOC-A (`CARI__AC_ILIS__FORMU_MERGED.pdf`), DOC-C (`CARI__AC_ILIS__FORMU-_O_RNEK_S_ABLON.docx`), DOC-D (`Cari_Hesap_Ac__l_s__Talep_Formu.html`)
- **Kaynak bölüm/referans:** DOC-A Sayfa 1/6 başlık; DOC-C görsel 1; DOC-D form başlığı
- **Açıklama:** Form başlığı: "Cari Hesap Açılış Talep Formu".
- **Etkilenen form:** Cari Form
- **Tür:** İçerik
- **Güven:** Açıkça belgelenmiş
- **Başlangıç durumu:** Kaynakla doğrulandı
- **Uygulama etkisi:** Canlı formun dosya adı "Cari Açılış Talep Formu"dur; kullanıcıya görünen başlık "Cari Hesap Açılış Talep Formu".
- **Açık sorular:** —

#### C-005

- **Kaynak belge:** DOC-A (`CARI__AC_ILIS__FORMU_MERGED.pdf`), DOC-C (`CARI__AC_ILIS__FORMU-_O_RNEK_S_ABLON.docx`), DOC-D (`Cari_Hesap_Ac__l_s__Talep_Formu.html`)
- **Kaynak bölüm/referans:** DOC-A Sayfa 1/6 başlık altı; DOC-C görsel 1; DOC-D form açıklaması
- **Açıklama:** Giriş metni birebir gösterilir: "Sistemimize tedarikçi veya müşteri olarak eklenmeniz ve faturalarınızın zamanında işleme alınabilmesi için bu formda gereken tüm bilgileri doğru şekilde doldurmanızı rica ederiz."
- **Etkilenen form:** Cari Form
- **Tür:** İçerik
- **Güven:** Açıkça belgelenmiş
- **Başlangıç durumu:** Kaynakla doğrulandı
- **Uygulama etkisi:** Metin formu dolduran karşı tarafa hitap eder (bkz. C-Q06).
- **Açık sorular:** —

#### C-006

- **Kaynak belge:** DOC-A (`CARI__AC_ILIS__FORMU_MERGED.pdf`), DOC-C (`CARI__AC_ILIS__FORMU-_O_RNEK_S_ABLON.docx`), DOC-D (`Cari_Hesap_Ac__l_s__Talep_Formu.html`)
- **Kaynak bölüm/referans:** DOC-A Sayfa 1/6 "Fatura Süreçleri Hakkında Önemli Bilgilendirme"; DOC-D form açıklaması
- **Açıklama:** Bilgilendirme "PO Numarası Zorunluluğu" birebir gösterilir: "Tüm tedarikçi faturalarında "E" harfi ile başlayan geçerli bir Satın Alma Sipariş (PO) numarası bulunmalıdır. PO numarası içermeyen faturalar kabul edilmeyecek ve ödeme süreci başlatılmadan iade edilecektir."
- **Etkilenen form:** Cari Form
- **Tür:** İş kuralı
- **Güven:** Açıkça belgelenmiş
- **Başlangıç durumu:** Kaynakla doğrulandı
- **Uygulama etkisi:** Bu bir fatura süreci kuralı için bilgilendirmedir; form PO numarası toplamaz veya doğrulamaz. Metin "tedarikçi faturaları"na atıf yapar.
- **Açık sorular:** "Bana fatura kesilecek" branşında gösterilip gösterilmeyeceği: C-Q05.

#### C-007

- **Kaynak belge:** DOC-A (`CARI__AC_ILIS__FORMU_MERGED.pdf`), DOC-C (`CARI__AC_ILIS__FORMU-_O_RNEK_S_ABLON.docx`), DOC-D (`Cari_Hesap_Ac__l_s__Talep_Formu.html`)
- **Kaynak bölüm/referans:** DOC-A Sayfa 1/6 "Fatura Süreçleri Hakkında Önemli Bilgilendirme"; DOC-D form açıklaması
- **Açıklama:** Bilgilendirme "Fatura Gönderimi" birebir gösterilir: "E-arşiv ve kağıt faturalarınızı lütfen PDF formatında ilgili e-posta adreslerimize iletiniz:" ve e-posta adresi finans@dome.istanbul (mailto bağlantısı).
- **Etkilenen form:** Cari Form
- **Tür:** İçerik
- **Güven:** Açıkça belgelenmiş
- **Başlangıç durumu:** Kaynakla doğrulandı
- **Uygulama etkisi:** Form e-posta göndermez; yalnızca bilgilendirir. Canlı formda adres "mailto:finans@dome.istanbul" bağlantısıdır (DOC-D).
- **Açık sorular:** "Bana fatura kesilecek" branşında gösterilip gösterilmeyeceği: C-Q05.

#### C-008

- **Kaynak belge:** DOC-A (`CARI__AC_ILIS__FORMU_MERGED.pdf`), DOC-C (`CARI__AC_ILIS__FORMU-_O_RNEK_S_ABLON.docx`), DOC-D (`Cari_Hesap_Ac__l_s__Talep_Formu.html`)
- **Kaynak bölüm/referans:** DOC-A Sayfa 1/6 başlık altı; DOC-C görsel 1; DOC-D form açıklamasının zengin metni
- **Açıklama:** Gizlilik onay metni gösterilir: "Bu formu doldurarak bu linkten ulaşabileceğiniz gizlilik politikamızı kabul etmiş sayılırsınız." İkinci kısım gizlilik politikasına bağlantıdır; canlı formdaki adres https://dome.istanbul/privacy-policy.
- **Etkilenen form:** Cari Form
- **Tür:** İçerik
- **Güven:** Açıkça belgelenmiş
- **Başlangıç durumu:** Kaynakla doğrulandı
- **Uygulama etkisi:** Ayrı bir onay kutusu belgede yok; metin bilgilendirme olarak gösterilir. Bağlantının çalışmadığı bildirildi (C-009, C-Q07).
- **Açık sorular:** —

#### C-009

- **Kaynak belge:** DOC-C (`CARI__AC_ILIS__FORMU-_O_RNEK_S_ABLON.docx`), DOC-D (`Cari_Hesap_Ac__l_s__Talep_Formu.html`)
- **Kaynak bölüm/referans:** DOC-C P002; adres DOC-D
- **Açıklama:** Mevcut formda gizlilik politikası bağlantısı (https://dome.istanbul/privacy-policy) boş sayfa açıyor; bağlantı çalışan bir gizlilik politikası sayfasına yönlenmelidir.
- **Etkilenen form:** Cari Form
- **Tür:** İşlevsel
- **Güven:** Açıkça belgelenmiş
- **Başlangıç durumu:** Kaynakla doğrulandı
- **Uygulama etkisi:** Doğru adres veya sayfanın düzeltilmesi C-Q07'ye bağlı. Adres yapılandırılabilir olmalı ve bilinmeden uydurulmamalı.
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

- **Kaynak belge:** DOC-A (`CARI__AC_ILIS__FORMU_MERGED.pdf`), DOC-D (`Cari_Hesap_Ac__l_s__Talep_Formu.html`)
- **Kaynak bölüm/referans:** DOC-A Sayfa 1/6, 2/6, 5/6, 6/6 alt kısım; DOC-D 6 bölüm
- **Açıklama:** Çok sayfalı akış: ilk sayfada "Sonraki"; ara sayfalarda "Geri" ve "Sonraki"; yolun son sayfasında "Geri" ve "Gönder". İlerleme göstergesi "Sayfa X / 6" (form 6 bölümdür; kullanıcı yalnızca kendi yolundaki sayfaları görür). Her sayfada "Formu temizle" eylemi.
- **Etkilenen form:** Cari Form
- **Tür:** Kullanıcı deneyimi
- **Güven:** Açıkça belgelenmiş
- **Başlangıç durumu:** Kaynakla doğrulandı
- **Uygulama etkisi:** Yeni yapıda sayfa sayısı ilk soru ve yönlendirmeye göre değişir. Geri dönüldüğünde girilen değerlerin korunması beklenir (platform davranışı).
- **Açık sorular:** —

#### C-020

- **Kaynak belge:** DOC-A (`CARI__AC_ILIS__FORMU_MERGED.pdf`), DOC-D (`Cari_Hesap_Ac__l_s__Talep_Formu.html`)
- **Kaynak bölüm/referans:** DOC-A Sayfa 1/6; doğrulama ayarı DOC-D
- **Açıklama:** "Talebi Gönderen Personel" — zorunlu kısa metin; açıklama "Şirket mailiniz".
- **Etkilenen form:** Cari Form
- **Tür:** İşlevsel
- **Güven:** Açıkça belgelenmiş
- **Başlangıç durumu:** Kaynakla doğrulandı
- **Uygulama etkisi:** Canlı formda bu alana "metin içerir" türünde bir yanıt doğrulaması eklenmiş ama değeri boş; fiilen hiçbir girişi engellemiyor ve e-posta biçimi denetlenmiyor (öneri: C-P01). "Personel" ifadesi formu doldurana dair belirsizlik yaratıyor (C-Q06).
- **Açık sorular:** —
- **İlgili alanlar:** `talepEden`

#### C-021

- **Kaynak belge:** DOC-A (`CARI__AC_ILIS__FORMU_MERGED.pdf`), DOC-C (`CARI__AC_ILIS__FORMU-_O_RNEK_S_ABLON.docx`), DOC-D (`Cari_Hesap_Ac__l_s__Talep_Formu.html`)
- **Kaynak bölüm/referans:** DOC-A Sayfa 1/6; DOC-C görsel 2; DOC-D Bölüm 1
- **Açıklama:** "Cari Türü" — tek seçimli (radyo) soru; mevcut formda zorunlu değil (yıldız yok) ve "Seçimi temizle" eylemi var. Mevcut seçenekler: Talent / Influencer, Marka, Ajans (C-002 ile değişir).
- **Etkilenen form:** Cari Form
- **Tür:** İşlevsel
- **Güven:** Açıkça belgelenmiş
- **Başlangıç durumu:** Kaynakla doğrulandı
- **Uygulama etkisi:** Seçenekler C-002'ye göre branşa bağlıdır. Canlı formda bu soru sayfa yönlendirmesi yapmaz. Zorunluluk: C-Q11.
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

- **Kaynak belge:** DOC-D (`Cari_Hesap_Ac__l_s__Talep_Formu.html`), DOC-A (`CARI__AC_ILIS__FORMU_MERGED.pdf`)
- **Kaynak bölüm/referans:** DOC-D Bölüm 1 (seçenek listesi); DOC-A Sayfa 1/6
- **Açıklama:** "Ülke" — zorunlu açılır liste. Seçenekler (bu sırayla): Türkiye, Amerika Birleşik Devletleri, Birleşik Krallık, Çin, Diğer.
- **Etkilenen form:** Cari Form
- **Tür:** İşlevsel
- **Güven:** Açıkça belgelenmiş
- **Başlangıç durumu:** Kaynakla doğrulandı
- **Uygulama etkisi:** "Diğer" düz bir seçenektir; serbest metin alanı açmaz. Ülke seçimi canlı formda hiçbir alanı veya sayfayı değiştirmez (C-Q04).
- **Açık sorular:** —
- **İlgili alanlar:** `ulke`

#### C-025

- **Kaynak belge:** DOC-D (`Cari_Hesap_Ac__l_s__Talep_Formu.html`), DOC-A (`CARI__AC_ILIS__FORMU_MERGED.pdf`)
- **Kaynak bölüm/referans:** DOC-D Bölüm 1 (soru türü); DOC-A Sayfa 1/6
- **Açıklama:** "İl ve İlçe" — zorunlu uzun metin (paragraf) sorusu; tek alan.
- **Etkilenen form:** Cari Form
- **Tür:** İşlevsel
- **Güven:** Açıkça belgelenmiş
- **Başlangıç durumu:** Kaynakla doğrulandı
- **Uygulama etkisi:** DOC-A ekran görüntüsünde tek satır gibi görünür; DOC-D soru türünün "paragraf" olduğunu gösterir.
- **Açık sorular:** —
- **İlgili alanlar:** `ilIlce`

#### C-026

- **Kaynak belge:** DOC-D (`Cari_Hesap_Ac__l_s__Talep_Formu.html`), DOC-A (`CARI__AC_ILIS__FORMU_MERGED.pdf`)
- **Kaynak bölüm/referans:** DOC-D Bölüm 1 (soru türü); DOC-A Sayfa 1/6
- **Açıklama:** "Adres" — zorunlu uzun metin (paragraf) sorusu.
- **Etkilenen form:** Cari Form
- **Tür:** İşlevsel
- **Güven:** Açıkça belgelenmiş
- **Başlangıç durumu:** Kaynakla doğrulandı
- **Uygulama etkisi:** DOC-A ekran görüntüsünde tek satır gibi görünür; DOC-D soru türünün "paragraf" olduğunu gösterir.
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

- **Kaynak belge:** DOC-D (`Cari_Hesap_Ac__l_s__Talep_Formu.html`), DOC-A (`CARI__AC_ILIS__FORMU_MERGED.pdf`)
- **Kaynak bölüm/referans:** DOC-D Bölüm 1 (seçenek listesi); DOC-A Sayfa 1/6
- **Açıklama:** "Şirket/Belge Türü" — zorunlu açılır liste. Seçenekler (bu sırayla): Limited / Anonim Şirketi, Şahıs Firması, İstisna Belgesi, Serbest Meslek Makbuzu, Gider Pusulası.
- **Etkilenen form:** Cari Form
- **Tür:** İşlevsel
- **Güven:** Açıkça belgelenmiş
- **Başlangıç durumu:** Kaynakla doğrulandı
- **Uygulama etkisi:** Seçim, Sayfa 1/6'dan sonra hangi sayfaların geleceğini belirler (C-041, C-042).
- **Açık sorular:** —
- **İlgili alanlar:** `sirketBelgeTuru`

#### C-036

- **Kaynak belge:** DOC-A (`CARI__AC_ILIS__FORMU_MERGED.pdf`), DOC-C (`CARI__AC_ILIS__FORMU-_O_RNEK_S_ABLON.docx`), DOC-D (`Cari_Hesap_Ac__l_s__Talep_Formu.html`)
- **Kaynak bölüm/referans:** DOC-A Sayfa 2/6; DOC-C görsel 4; DOC-D Bölüm 2 (uzunluk doğrulaması)
- **Açıklama:** Sayfa 2/6 "Vergi Bilgileri - Vergi Numarası / TC Kimlik No": "Vergi Numarası / TC Kimlik No" — zorunlu kısa metin; en fazla 15 karakter.
- **Etkilenen form:** Cari Form
- **Tür:** Doğrulama
- **Güven:** Açıkça belgelenmiş
- **Başlangıç durumu:** Kaynakla doğrulandı
- **Uygulama etkisi:** Uzunluk sınırı canlı formdan gelir; özel hata metni tanımlanmamış (Google varsayılanı). 15 karakter sınırı yabancı vergi numaralarına da yer bırakır. Rakam/hane kuralı yok (öneri: C-P03). Bu sayfa yalnızca Limited / Anonim Şirketi ve Şahıs Firması yolunda gösterilir.
- **Açık sorular:** —
- **İlgili alanlar:** `vergiNo`

#### C-037

- **Kaynak belge:** DOC-A (`CARI__AC_ILIS__FORMU_MERGED.pdf`), DOC-D (`Cari_Hesap_Ac__l_s__Talep_Formu.html`)
- **Kaynak bölüm/referans:** DOC-A Sayfa 5/6; DOC-D Bölüm 5
- **Açıklama:** Sayfa 5/6 "İstisna Belgesi": "İstisna Belgesi" — zorunlu dosya yükleme; açıklama "Desteklenen 1 dosya yükleyebilirsiniz. En fazla 10 MB olmalıdır."
- **Etkilenen form:** Cari Form
- **Tür:** Doğrulama
- **Güven:** Açıkça belgelenmiş
- **Başlangıç durumu:** Kaynakla doğrulandı
- **Uygulama etkisi:** En fazla 1 dosya, en fazla 10 MB. Desteklenen türler belgede yok (C-Q12). Bu sayfa yalnızca Şirket/Belge Türü = İstisna Belgesi yolunda gösterilir; ardından Sayfa 3/6 "TC Kimlik No" gelir (C-042).
- **Açık sorular:** —
- **İlgili alanlar:** `istisnaBelgesi`

#### C-038

- **Kaynak belge:** DOC-A (`CARI__AC_ILIS__FORMU_MERGED.pdf`), DOC-C (`CARI__AC_ILIS__FORMU-_O_RNEK_S_ABLON.docx`), DOC-D (`Cari_Hesap_Ac__l_s__Talep_Formu.html`)
- **Kaynak bölüm/referans:** DOC-A Sayfa 6/6; DOC-C görsel 5; DOC-D Bölüm 4
- **Açıklama:** "Vergi Bilgileri - Vergi Dairesi" sayfası: "Vergi Dairesi" — zorunlu kısa metin. Canlı formda bu sayfa 4/6'dır (DOC-A'da 6/6) ve ardından form gönderilir.
- **Etkilenen form:** Cari Form
- **Tür:** İşlevsel
- **Güven:** Açıkça belgelenmiş
- **Başlangıç durumu:** Kaynakla doğrulandı
- **Uygulama etkisi:** Yalnızca Limited / Anonim Şirketi ve Şahıs Firması yolunda, Sayfa 2/6'dan sonra gösterilir. Sayfa numarası farkı: C-Q13.
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
- **Uygulama etkisi:** Not "yapabiliriz" diyor; öneri niteliğinde. Canlı formda (DOC-D) böyle bir alan yok. Onaylanırsa: dosya türü PDF.
- **Açık sorular:** Tek dosya mı (vergi levhası + banka bilgisi birlikte) yoksa iki ayrı yükleme mi? Zorunlu mu? Boyut sınırı? Her iki branşta mı? "İmzalı" şartı nasıl kontrol edilecek (yalnızca açıklama mı)?
- **İlgili alanlar:** `belgeYukleme`

#### C-041

- **Kaynak belge:** DOC-D (`Cari_Hesap_Ac__l_s__Talep_Formu.html`)
- **Kaynak bölüm/referans:** DOC-D Bölüm 1 — "Şirket/Belge Türü" seçeneklerinin "yanıta göre bölüme git" değerleri
- **Açıklama:** Yanıta göre yönlendirme: Limited / Anonim Şirketi → Sayfa 2/6 "Vergi Bilgileri - Vergi Numarası / TC Kimlik No"; Şahıs Firması → Sayfa 2/6; İstisna Belgesi → Sayfa 5/6 "İstisna Belgesi"; Serbest Meslek Makbuzu → Sayfa 3/6 "TC Kimlik No"; Gider Pusulası → Sayfa 3/6 "TC Kimlik No".
- **Etkilenen form:** Cari Form
- **Tür:** İş kuralı
- **Güven:** Açıkça belgelenmiş
- **Başlangıç durumu:** Kaynakla doğrulandı
- **Uygulama etkisi:** Sayfa 1/6'daki "Sonraki" düğmesi seçilen türe göre farklı sayfaya gider. Yönlendirme fatura yönünden bağımsızdır (C-Q05).
- **Açık sorular:** —
- **İlgili alanlar:** `sirketBelgeTuru`

#### C-042

- **Kaynak belge:** DOC-D (`Cari_Hesap_Ac__l_s__Talep_Formu.html`)
- **Kaynak bölüm/referans:** DOC-D bölüm başlıklarındaki "bölümden sonra" yönlendirmeleri
- **Açıklama:** Tam yollar: (1) Limited / Anonim Şirketi, Şahıs Firması: Sayfa 1/6 → 2/6 Vergi Numarası / TC Kimlik No → 4/6 Vergi Dairesi → Gönder (3/6 atlanır). (2) Serbest Meslek Makbuzu, Gider Pusulası: Sayfa 1/6 → 3/6 TC Kimlik No → Gönder. (3) İstisna Belgesi: Sayfa 1/6 → 5/6 İstisna Belgesi → 3/6 TC Kimlik No → Gönder.
- **Etkilenen form:** Cari Form
- **Tür:** İş kuralı
- **Güven:** Güçlü çıkarım
- **Başlangıç durumu:** Kaynakla doğrulandı
- **Uygulama etkisi:** Google Forms bir bölümden sonra nereye gidileceğini bir sonraki bölüm başlığında saklar ("bu sayfa sonundan önceki sayfayı tamamlayınca"); yollar bu kurala göre okundu. Yol dışında kalan sayfalardaki yanıtlar gönderilmez (platform davranışı). İstisna yolunda sayfa sırası 5/6 → 3/6'dır; ilerleme göstergesi bu nedenle geri sayar.
- **Açık sorular:** —
- **İlgili alanlar:** `sirketBelgeTuru`, `vergiNo`, `tcKimlikNo`, `vergiDairesi`, `istisnaBelgesi`

#### C-043

- **Kaynak belge:** DOC-D (`Cari_Hesap_Ac__l_s__Talep_Formu.html`)
- **Kaynak bölüm/referans:** DOC-D Bölüm 3 "TC Kimlik No"
- **Açıklama:** Sayfa 3/6 "TC Kimlik No": "TC Kimlik No" — zorunlu kısa metin; en fazla 11 karakter.
- **Etkilenen form:** Cari Form
- **Tür:** Doğrulama
- **Güven:** Açıkça belgelenmiş
- **Başlangıç durumu:** Kaynakla doğrulandı
- **Uygulama etkisi:** Yalnızca Serbest Meslek Makbuzu, Gider Pusulası ve İstisna Belgesi yollarında gösterilir; bu sayfadan sonra form gönderilir. Özel hata metni tanımlanmamış (Google varsayılanı). Rakam/hane kuralı yok (öneri: C-P10).
- **Açık sorular:** —
- **İlgili alanlar:** `tcKimlikNo`

#### C-044

- **Kaynak belge:** DOC-D (`Cari_Hesap_Ac__l_s__Talep_Formu.html`)
- **Kaynak bölüm/referans:** DOC-D form ayarları — onay mesajı
- **Açıklama:** Gönderimden sonra gösterilen onay mesajı: "Teşekkürler. Cari Talebiniz Alınmıştır."
- **Etkilenen form:** Cari Form
- **Tür:** İçerik
- **Güven:** Açıkça belgelenmiş
- **Başlangıç durumu:** Kaynakla doğrulandı
- **Uygulama etkisi:** Gönderim sonrası ekran bu metni birebir göstermelidir.
- **Açık sorular:** —

#### C-045

- **Kaynak belge:** DOC-D (`Cari_Hesap_Ac__l_s__Talep_Formu.html`)
- **Kaynak bölüm/referans:** DOC-D Bölüm 6 "Submit"
- **Açıklama:** Canlı formun 6. bölümü "Submit" başlıklı ve soru içermeyen teknik bir bölümdür; "İstisna Belgesi" sayfasından sonra "TC Kimlik No" sayfasına gitmeyi sağlar ve hiçbir yoldan ulaşılmaz.
- **Etkilenen form:** Cari Form
- **Tür:** Teknik
- **Güven:** Güçlü çıkarım
- **Başlangıç durumu:** Kaynakla doğrulandı
- **Uygulama etkisi:** Yeni uygulamada bu bölümün karşılığı kullanıcıya gösterilmemelidir; yalnızca yönlendirme (C-042) korunmalıdır.
- **Açık sorular:** —

#### C-Q01 · ENGELLEYİCİ

- **Kaynak belge:** DOC-D (`Cari_Hesap_Ac__l_s__Talep_Formu.html`), DOC-A (`CARI__AC_ILIS__FORMU_MERGED.pdf`)
- **Kaynak bölüm/referans:** DOC-D Bölüm 3 ve 4; DOC-A sayfa göstergeleri (1/6, 2/6, 5/6, 6/6)
- **Açıklama:** Cevaplandı (DOC-D): DOC-A'da görünmeyen sayfalar canlı formda Sayfa 3/6 "TC Kimlik No" ve Sayfa 4/6 "Vergi Bilgileri - Vergi Dairesi"dir; 6. bölüm boş teknik "Submit" bölümüdür.
- **Etkilenen form:** Cari Form
- **Tür:** İşlevsel
- **Güven:** Açıkça belgelenmiş
- **Başlangıç durumu:** Kaynakla doğrulandı
- **Uygulama etkisi:** Formun tam alan envanteri artık biliniyor (C-042, C-043, C-045). DOC-A ile sayfa numarası farkı: C-Q13.
- **Açık sorular:** —
- **İlgili alanlar:** `tcKimlikNo`, `vergiDairesi`

#### C-Q02 · ENGELLEYİCİ

- **Kaynak belge:** DOC-D (`Cari_Hesap_Ac__l_s__Talep_Formu.html`), DOC-A (`CARI__AC_ILIS__FORMU_MERGED.pdf`)
- **Kaynak bölüm/referans:** DOC-D Bölüm 1 "Şirket/Belge Türü"; DOC-A Sayfa 1/6
- **Açıklama:** Cevaplandı (DOC-D): "Şirket/Belge Türü" seçenekleri Limited / Anonim Şirketi, Şahıs Firması, İstisna Belgesi, Serbest Meslek Makbuzu, Gider Pusulası'dır (DOC-A'da yalnızca seçili değer görünüyordu).
- **Etkilenen form:** Cari Form
- **Tür:** İşlevsel
- **Güven:** Açıkça belgelenmiş
- **Başlangıç durumu:** Kaynakla doğrulandı
- **Uygulama etkisi:** Bkz. C-035 ve yönlendirme C-041.
- **Açık sorular:** —
- **İlgili alanlar:** `sirketBelgeTuru`

#### C-Q03 · ENGELLEYİCİ

- **Kaynak belge:** DOC-D (`Cari_Hesap_Ac__l_s__Talep_Formu.html`)
- **Kaynak bölüm/referans:** DOC-D seçenek ve bölüm yönlendirmeleri
- **Açıklama:** Cevaplandı (DOC-D): "İstisna Belgesi" sayfası yalnızca Şirket/Belge Türü = İstisna Belgesi seçildiğinde açılır ve ardından "TC Kimlik No" sayfası gelir. Tüm yollar C-042'dedir.
- **Etkilenen form:** Cari Form
- **Tür:** İşlevsel
- **Güven:** Güçlü çıkarım
- **Başlangıç durumu:** Kaynakla doğrulandı
- **Uygulama etkisi:** Bölüm sonu yönlendirmeleri Google Forms'un saklama kuralına göre okundu (C-042).
- **Açık sorular:** —
- **İlgili alanlar:** `istisnaBelgesi`, `sirketBelgeTuru`

#### C-Q04

- **Kaynak belge:** DOC-C (`CARI__AC_ILIS__FORMU-_O_RNEK_S_ABLON.docx`), DOC-D (`Cari_Hesap_Ac__l_s__Talep_Formu.html`)
- **Kaynak bölüm/referans:** DOC-C P008, P012 (Yurtdışı kategorileri) ↔ DOC-D (ülke listesi ve ülkeden bağımsız zorunlu alanlar)
- **Açıklama:** Yurtdışı cariler için alanlar nasıl davranmalı? DOCX "Yurtdışı Satıcı (Ajans)" ve "Yurtdışı Müşteri" kategorilerini ekliyor. Canlı formda ülke listesi Türkiye, Amerika Birleşik Devletleri, Birleşik Krallık, Çin, Diğer; ancak ülke seçimi hiçbir alanı değiştirmiyor (İl ve İlçe, Posta Kodu, IBAN (TRY), Vergi Numarası / TC Kimlik No veya TC Kimlik No, Vergi Dairesi herkese zorunlu).
- **Etkilenen form:** Cari Form
- **Tür:** Çözümsüz / açık
- **Güven:** Belirsiz
- **Başlangıç durumu:** Açık soru
- **Uygulama etkisi:** Karar verilene kadar canlı formdaki davranış korunur: tüm ülkeler için aynı alanlar ve zorunluluklar. Kural uydurulmamalı.
- **Açık sorular:** Yurtdışı carilerde hangi alanlar zorunlu/opsiyonel/gizli olmalı? Ülke listesi genişletilecek mi?
- **İlgili alanlar:** `ulke`, `cariTuru`, `vergiNo`, `vergiDairesi`, `ibanTry`, `postaKodu`, `ilIlce`

#### C-Q05

- **Kaynak belge:** DOC-C (`CARI__AC_ILIS__FORMU-_O_RNEK_S_ABLON.docx`), DOC-A (`CARI__AC_ILIS__FORMU_MERGED.pdf`), DOC-D (`Cari_Hesap_Ac__l_s__Talep_Formu.html`)
- **Kaynak bölüm/referans:** DOC-C P004–P012 yalnızca kategori listesini ayırıyor; DOC-A/DOC-D bilgilendirme, IBAN ve Şirket/Belge Türü yönlendirmesi
- **Açıklama:** İki branş arasında kategori listesi dışında başka fark var mı? Özellikle: (a) "Bana fatura kesilecek" branşında IBAN (TRY) zorunlu mu? (b) PO Numarası ve Fatura Gönderimi bilgilendirmesi bu branşta gösterilmeli mi? (c) PDF yükleme önerisi hangi branşlarda geçerli? (d) Şirket/Belge Türü seçenekleri ve sayfa yönlendirmesi (İstisna Belgesi, Serbest Meslek Makbuzu, Gider Pusulası dahil) "Bana fatura kesilecek" branşında aynı mı kalacak?
- **Etkilenen form:** Cari Form
- **Tür:** Çözümsüz / açık
- **Güven:** Belirsiz
- **Başlangıç durumu:** Açık soru
- **Uygulama etkisi:** Karar verilene kadar iki branş, kategori listesi dışında aynı alanları ve aynı yönlendirmeyi kullanır; farklar uydurulmaz.
- **Açık sorular:** —
- **İlgili alanlar:** `ibanTry`, `belgeYukleme`, `sirketBelgeTuru`

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

- **Kaynak belge:** DOC-C (`CARI__AC_ILIS__FORMU-_O_RNEK_S_ABLON.docx`), DOC-D (`Cari_Hesap_Ac__l_s__Talep_Formu.html`)
- **Kaynak bölüm/referans:** DOC-C P002; adres DOC-D
- **Açıklama:** Gizlilik politikası bağlantısı nasıl düzeltilecek? Canlı formdaki adres https://dome.istanbul/privacy-policy; DOCX'e göre bu bağlantı boş sayfa açıyor. Doğru adres başka mı, yoksa bu adresteki sayfa mı düzeltilecek?
- **Etkilenen form:** Cari Form
- **Tür:** Çözümsüz / açık
- **Güven:** Belirsiz
- **Başlangıç durumu:** Açık soru
- **Uygulama etkisi:** Karar verilene kadar adres yapılandırılabilir olmalı; mevcut adres varsayılan değer olarak kullanılabilir ama doğrulanmış sayılmaz.
- **Açık sorular:** —

#### C-Q08

- **Kaynak belge:** DOC-A (`CARI__AC_ILIS__FORMU_MERGED.pdf`), DOC-D (`Cari_Hesap_Ac__l_s__Talep_Formu.html`)
- **Kaynak bölüm/referans:** DOC-A tüm sayfalar (oturum açık hesap, "Bu form DOME alanında oluşturuldu"); DOC-D alan bilgisi "DOME"
- **Açıklama:** Mevcut form Google Forms'ta, DOME alanında ve oturum açmış Google hesabıyla çalışıyor ("Dosyaları yükleyip bu formu gönderdiğinizde Google hesabınızla ilişkilendirilen ad, e-posta adresi ve fotoğraf kaydedilir"). Yeni uygulamada kimlik doğrulama gerekecek mi?
- **Etkilenen form:** Cari Form
- **Tür:** Teknik
- **Güven:** Belirsiz
- **Başlangıç durumu:** Açık soru
- **Uygulama etkisi:** C-Q06 ile bağlantılı. Karar verilmeden kimlik doğrulama eklenmemeli/kaldırılmamalı.
- **Açık sorular:** —

#### C-Q09 · ENGELLEYİCİ

- **Kaynak belge:** DOC-A (`CARI__AC_ILIS__FORMU_MERGED.pdf`), DOC-D (`Cari_Hesap_Ac__l_s__Talep_Formu.html`)
- **Kaynak bölüm/referans:** DOC-A Sayfa 6/6 "Gönder"; DOC-D (gönderim hedefi tanımda görünmüyor)
- **Açıklama:** Gönderim sonrası ne olur ve uygulama hangi platformda geliştirilecek? Yanıtlar ve yüklenen dosyalar nereye kaydedilir/iletilir (tablo, e-posta, muhasebe yazılımı)? Kime bildirim gider? Google Forms'ta mı kalınacak, özel bir uygulama mı yapılacak?
- **Etkilenen form:** Cari Form
- **Tür:** Teknik
- **Güven:** Belirsiz
- **Başlangıç durumu:** Açık soru
- **Uygulama etkisi:** Bu bilinmeden gerçek gönderim, depolama veya entegrasyon uygulanamaz. Kullanıcıya gösterilecek onay mesajı biliniyor (C-044).
- **Açık sorular:** —

#### C-Q10

- **Kaynak belge:** DOC-C (`CARI__AC_ILIS__FORMU-_O_RNEK_S_ABLON.docx`)
- **Kaynak bölüm/referans:** DOC-C görsel 4 ve 5 (P015–P016)
- **Açıklama:** DOCX'te "Vergi Numarası / TC Kimlik No" (Sayfa 2/6) ve "Vergi Dairesi" (Sayfa 6/6) ekran görüntüleri not olmadan yer alıyor. Bir değişiklik mi isteniyor (ör. iki vergi alanının aynı sayfada birleştirilmesi)?
- **Etkilenen form:** Cari Form
- **Tür:** Çözümsüz / açık
- **Güven:** Belirsiz
- **Başlangıç durumu:** Açık soru
- **Uygulama etkisi:** Değişiklik varsayılmaz; mevcut sayfa yapısı korunur. DOC-D'ye göre bu iki sayfa Limited / Anonim Şirketi ve Şahıs Firması yolunda art arda gelir.
- **Açık sorular:** —
- **İlgili alanlar:** `vergiNo`, `vergiDairesi`

#### C-Q11

- **Kaynak belge:** DOC-A (`CARI__AC_ILIS__FORMU_MERGED.pdf`), DOC-C (`CARI__AC_ILIS__FORMU-_O_RNEK_S_ABLON.docx`), DOC-D (`Cari_Hesap_Ac__l_s__Talep_Formu.html`)
- **Kaynak bölüm/referans:** DOC-A Sayfa 1/6 "Cari Türü" (yıldız yok); DOC-D (zorunlu değil); DOC-C P005/P010 ("…birini seçin lütfen")
- **Açıklama:** Fatura yönüne göre değişen kategori sorusu (Cari Türü) zorunlu mu olacak? Mevcut formda zorunlu değil.
- **Etkilenen form:** Cari Form
- **Tür:** Çözümsüz / açık
- **Güven:** Belirsiz
- **Başlangıç durumu:** Açık soru
- **Uygulama etkisi:** Karar verilene kadar belgedeki gibi isteğe bağlı kalır.
- **Açık sorular:** —
- **İlgili alanlar:** `cariTuru`

#### C-Q12

- **Kaynak belge:** DOC-A (`CARI__AC_ILIS__FORMU_MERGED.pdf`), DOC-D (`Cari_Hesap_Ac__l_s__Talep_Formu.html`)
- **Kaynak bölüm/referans:** DOC-A Sayfa 5/6; DOC-D (dosya ayarları tanımda yok)
- **Açıklama:** "İstisna Belgesi" için desteklenen dosya türleri nelerdir? Belgede "Desteklenen 1 dosya" deniyor ancak türler listelenmiyor.
- **Etkilenen form:** Cari Form
- **Tür:** Çözümsüz / açık
- **Güven:** Belirsiz
- **Başlangıç durumu:** Açık soru
- **Uygulama etkisi:** Karar verilene kadar tür kısıtı uygulanmaz; yalnızca 1 dosya ve 10 MB sınırı uygulanır. Not: Google Forms'ta tür kısıtı varsa açıklamada türler listelenir (Talent formundaki "image" gibi); burada liste olmaması kısıt olmadığına işaret ediyor.
- **Açık sorular:** —
- **İlgili alanlar:** `istisnaBelgesi`

#### C-Q13 · BELGE ÇELİŞKİSİ

- **Kaynak belge:** DOC-A (`CARI__AC_ILIS__FORMU_MERGED.pdf`), DOC-D (`Cari_Hesap_Ac__l_s__Talep_Formu.html`)
- **Kaynak bölüm/referans:** DOC-A PDF s.5 ("Vergi Dairesi" — Sayfa 6/6) ↔ DOC-D (Vergi Dairesi Bölüm 4, Bölüm 6 boş "Submit")
- **Açıklama:** Belge çelişkisi (sürüm farkı): DOC-A ekran görüntülerinde "Vergi Bilgileri - Vergi Dairesi" sayfası "Sayfa 6/6", canlı formda (DOC-D) ise 4. bölüm; 6. bölüm boş "Submit" bölümü. Form, ekran görüntüleri alındıktan sonra değiştirilmiş görünüyor. Güncel yapı DOC-D mi?
- **Etkilenen form:** Cari Form
- **Tür:** Çözümsüz / açık
- **Güven:** Belirsiz
- **Başlangıç durumu:** Açık soru
- **Uygulama etkisi:** Prototip ve prompt daha yeni olan DOC-D yapısını kullanır; sayfa numaraları yeni uygulamada zaten değişecektir.
- **Açık sorular:** —
- **İlgili alanlar:** `vergiDairesi`

#### C-P01

- **Kaynak belge:** ANALIZ (Analist önerisi (kaynak belgelerde yok))
- **Kaynak bölüm/referans:** Belgede yok — alan adlarından çıkarım ("mail")
- **Açıklama:** E-posta format doğrulaması: Talebi Gönderen Personel, Yetkili Mail, Finans Mail alanları geçerli e-posta biçiminde olmalı.
- **Etkilenen form:** Cari Form
- **Tür:** Doğrulama
- **Güven:** Belirsiz
- **Başlangıç durumu:** Önerilen iyileştirme
- **Uygulama etkisi:** Öneri durumundayken prototipte yalnızca uyarı (engellemez). Onaylanırsa hata olur. Canlı formdaki "metin içerir (boş)" kuralı bunu sağlamıyor (C-020).
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
- **Uygulama etkisi:** Öneri durumundayken yalnızca uyarı. Canlı formda bu alan için yalnızca "en fazla 15 karakter" kuralı var (C-036); 10/11 hane kuralı yabancı vergi numaralarını reddeder (C-Q04). Algoritmik sağlama (checksum) önerilmiyor.
- **Açık sorular:** Kural yalnızca Ülke = Türkiye iken mi uygulanmalı?
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

#### C-P10

- **Kaynak belge:** ANALIZ (Analist önerisi (kaynak belgelerde yok))
- **Kaynak bölüm/referans:** Belgede yok — alan etiketinden çıkarım
- **Açıklama:** TC Kimlik No: tam 11 hane, yalnızca rakam.
- **Etkilenen form:** Cari Form
- **Tür:** Doğrulama
- **Güven:** Belirsiz
- **Başlangıç durumu:** Önerilen iyileştirme
- **Uygulama etkisi:** Öneri durumundayken yalnızca uyarı. Canlı formda yalnızca "en fazla 11 karakter" kuralı var (C-043). Algoritmik sağlama (checksum) önerilmiyor.
- **Açık sorular:** —
- **İlgili alanlar:** `tcKimlikNo`

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
- **Açıklama:** Gönderim sonrası ne olur ve uygulama hangi platformda geliştirilecek? Yanıtlar ve fotoğraf nereye kaydedilir/iletilir? Kime bildirim gider? Kullanıcıya hangi onay mesajı gösterilir? Google Forms'ta mı kalınacak, özel bir uygulama mı yapılacak?
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
| S-002 | Çözümsüz / açık | Belirsiz | Açık soru | DOC-A, DOC-D, DOC-B | "İstisna Belgesi", "Serbest Meslek Makbuzu" ve "Gider Pusulası" iki formda da belge türü seçeneği olarak geçiyor. Cari Hesap Açılış Talep… |
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

- **Kaynak belge:** DOC-A (`CARI__AC_ILIS__FORMU_MERGED.pdf`), DOC-D (`Cari_Hesap_Ac__l_s__Talep_Formu.html`), DOC-B (`Yeni_Talent_Formu_MERGED.pdf`)
- **Kaynak bölüm/referans:** DOC-A/DOC-D Cari formu belge türü seçenekleri ve "İstisna Belgesi" yükleme sayfası ↔ DOC-B Alan 8 "Belge Tipi" seçenekleri
- **Açıklama:** "İstisna Belgesi", "Serbest Meslek Makbuzu" ve "Gider Pusulası" iki formda da belge türü seçeneği olarak geçiyor. Cari Hesap Açılış Talep Formu'nda "İstisna Belgesi" seçimi ayrıca zorunlu bir belge yükleme sayfası açıyor; Yeni Talent Formu'nda bu seçeneklere bağlı bir davranış yok. İki form arasındaki ilişki (ör. aynı kavram mı, Talent formunda da belge istenmeli mi) belgelenmemiş.
- **Etkilenen form:** Her iki form — Cari etkisi: Bu formda bu türler "Şirket/Belge Türü" seçenekleridir ve sayfa yönlendirmesini belirler (C-041). Yeni Talent Formu ile otomatik bağlantı kurma. / Talent etkisi: Bu formda bu türler "Belge Tipi" seçenekleridir ve koşullu davranış yoktur. Karar verilene kadar ek yükleme alanı veya formlar arası kural eklenmez.
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

