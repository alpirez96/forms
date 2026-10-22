# Açık Sorular ve Onayınızı Bekleyen Kararlar

> `npm run docs` ile otomatik üretilir. Bu liste inceleme öncesi durumu gösterir; cevaplarınızı uygulamada ilgili maddenin "Cevap / karar notu" alanına yazın.

## 1. Engelleyici sorular (cevaplanmadan güvenilir final prompt üretilemez) — 2

### Cari Form

- **C-Q09** — Gönderim sonrası ne olur ve uygulama hangi platformda geliştirilecek? Yanıtlar ve yüklenen dosyalar nereye kaydedilir/iletilir (tablo, e-posta, muhasebe yazılımı)? Kime bildirim gider? Google Forms'ta mı kalınacak, özel bir uygulama mı yapılacak?
  - Kaynak: DOC-A, DOC-D — DOC-A Sayfa 6/6 "Gönder"; DOC-D (gönderim hedefi tanımda görünmüyor)
  - Etki / geçici davranış: Bu bilinmeden gerçek gönderim, depolama veya entegrasyon uygulanamaz. Kullanıcıya gösterilecek onay mesajı biliniyor (C-044).

### Yeni Talent Form

- **T-Q06** — Gönderim sonrası ne olur ve uygulama hangi platformda geliştirilecek? Yanıtlar ve fotoğraf nereye kaydedilir/iletilir? Kime bildirim gider? Kullanıcıya hangi onay mesajı gösterilir? Google Forms'ta mı kalınacak, özel bir uygulama mı yapılacak?
  - Kaynak: DOC-B — "Gönder" (gönderim sonrası belgelenmemiş)
  - Etki / geçici davranış: Bu bilinmeden gerçek gönderim, depolama veya entegrasyon uygulanamaz.

## 2. Belge çelişkileri — 2

### Cari Form

- **C-Q06** — Belge çelişkisi: Formu kim dolduruyor? Giriş metni ve DOCX kategori notları karşı tarafa (tedarikçi/müşteri) hitap ediyor; "Talebi Gönderen Personel — Şirket mailiniz" ise DOME personelinin doldurduğunu düşündürüyor.
  - Kaynak: DOC-A, DOC-C — DOC-A giriş metni ("Sistemimize … eklenmeniz") ↔ DOC-A "Talebi Gönderen Personel – Şirket mailiniz"
  - Etki / geçici davranış: İlk sorunun bakış açısı ("Fatura keseceğim" kimin ağzından), metinlerin hitabı ve kimlik doğrulama ihtiyacı buna bağlı. Prototip DOCX notlarının hitabını (karşı taraf) esas alır.
  - Ayrıntı: Form dış tarafa mı gönderiliyor, yoksa personel karşı taraf adına mı dolduruyor?
- **C-Q13** — Belge çelişkisi (sürüm farkı): DOC-A ekran görüntülerinde "Vergi Bilgileri - Vergi Dairesi" sayfası "Sayfa 6/6", canlı formda (DOC-D) ise 4. bölüm; 6. bölüm boş "Submit" bölümü. Form, ekran görüntüleri alındıktan sonra değiştirilmiş görünüyor. Güncel yapı DOC-D mi?
  - Kaynak: DOC-A, DOC-D — DOC-A PDF s.5 ("Vergi Dairesi" — Sayfa 6/6) ↔ DOC-D (Vergi Dairesi Bölüm 4, Bölüm 6 boş "Submit")
  - Etki / geçici davranış: Prototip ve prompt daha yeni olan DOC-D yapısını kullanır; sayfa numaraları yeni uygulamada zaten değişecektir.

## 3. Diğer açık sorular — 15

### Cari Form

- **C-Q04** — Yurtdışı cariler için alanlar nasıl davranmalı? DOCX "Yurtdışı Satıcı (Ajans)" ve "Yurtdışı Müşteri" kategorilerini ekliyor. Canlı formda ülke listesi Türkiye, Amerika Birleşik Devletleri, Birleşik Krallık, Çin, Diğer; ancak ülke seçimi hiçbir alanı değiştirmiyor (İl ve İlçe, Posta Kodu, IBAN (TRY), Vergi Numarası / TC Kimlik No veya TC Kimlik No, Vergi Dairesi herkese zorunlu).
  - Kaynak: DOC-C, DOC-D — DOC-C P008, P012 (Yurtdışı kategorileri) ↔ DOC-D (ülke listesi ve ülkeden bağımsız zorunlu alanlar)
  - Etki / geçici davranış: Karar verilene kadar canlı formdaki davranış korunur: tüm ülkeler için aynı alanlar ve zorunluluklar. Kural uydurulmamalı.
  - Ayrıntı: Yurtdışı carilerde hangi alanlar zorunlu/opsiyonel/gizli olmalı? Ülke listesi genişletilecek mi?
- **C-Q05** — İki branş arasında kategori listesi dışında başka fark var mı? Özellikle: (a) "Bana fatura kesilecek" branşında IBAN (TRY) zorunlu mu? (b) PO Numarası ve Fatura Gönderimi bilgilendirmesi bu branşta gösterilmeli mi? (c) PDF yükleme önerisi hangi branşlarda geçerli? (d) Şirket/Belge Türü seçenekleri ve sayfa yönlendirmesi (İstisna Belgesi, Serbest Meslek Makbuzu, Gider Pusulası dahil) "Bana fatura kesilecek" branşında aynı mı kalacak?
  - Kaynak: DOC-C, DOC-A, DOC-D — DOC-C P004–P012 yalnızca kategori listesini ayırıyor; DOC-A/DOC-D bilgilendirme, IBAN ve Şirket/Belge Türü yönlendirmesi
  - Etki / geçici davranış: Karar verilene kadar iki branş, kategori listesi dışında aynı alanları ve aynı yönlendirmeyi kullanır; farklar uydurulmaz.
- **C-Q07** — Gizlilik politikası bağlantısı nasıl düzeltilecek? Canlı formdaki adres https://dome.istanbul/privacy-policy; DOCX'e göre bu bağlantı boş sayfa açıyor. Doğru adres başka mı, yoksa bu adresteki sayfa mı düzeltilecek?
  - Kaynak: DOC-C, DOC-D — DOC-C P002; adres DOC-D
  - Etki / geçici davranış: Karar verilene kadar adres yapılandırılabilir olmalı; mevcut adres varsayılan değer olarak kullanılabilir ama doğrulanmış sayılmaz.
- **C-Q08** — Mevcut form Google Forms'ta, DOME alanında ve oturum açmış Google hesabıyla çalışıyor ("Dosyaları yükleyip bu formu gönderdiğinizde Google hesabınızla ilişkilendirilen ad, e-posta adresi ve fotoğraf kaydedilir"). Yeni uygulamada kimlik doğrulama gerekecek mi?
  - Kaynak: DOC-A, DOC-D — DOC-A tüm sayfalar (oturum açık hesap, "Bu form DOME alanında oluşturuldu"); DOC-D alan bilgisi "DOME"
  - Etki / geçici davranış: C-Q06 ile bağlantılı. Karar verilmeden kimlik doğrulama eklenmemeli/kaldırılmamalı.
- **C-Q10** — DOCX'te "Vergi Numarası / TC Kimlik No" (Sayfa 2/6) ve "Vergi Dairesi" (Sayfa 6/6) ekran görüntüleri not olmadan yer alıyor. Bir değişiklik mi isteniyor (ör. iki vergi alanının aynı sayfada birleştirilmesi)?
  - Kaynak: DOC-C — DOC-C görsel 4 ve 5 (P015–P016)
  - Etki / geçici davranış: Değişiklik varsayılmaz; mevcut sayfa yapısı korunur. DOC-D'ye göre bu iki sayfa Limited / Anonim Şirketi ve Şahıs Firması yolunda art arda gelir.
- **C-Q11** — Fatura yönüne göre değişen kategori sorusu (Cari Türü) zorunlu mu olacak? Mevcut formda zorunlu değil.
  - Kaynak: DOC-A, DOC-C, DOC-D — DOC-A Sayfa 1/6 "Cari Türü" (yıldız yok); DOC-D (zorunlu değil); DOC-C P005/P010 ("…birini seçin lütfen")
  - Etki / geçici davranış: Karar verilene kadar belgedeki gibi isteğe bağlı kalır.
- **C-Q12** — "İstisna Belgesi" için desteklenen dosya türleri nelerdir? Belgede "Desteklenen 1 dosya" deniyor ancak türler listelenmiyor.
  - Kaynak: DOC-A, DOC-D — DOC-A Sayfa 5/6; DOC-D (dosya ayarları tanımda yok)
  - Etki / geçici davranış: Karar verilene kadar tür kısıtı uygulanmaz; yalnızca 1 dosya ve 10 MB sınırı uygulanır. Not: Google Forms'ta tür kısıtı varsa açıklamada türler listelenir (Talent formundaki "image" gibi); burada liste olmaması kısıt olmadığına işaret ediyor.

### Yeni Talent Form

- **T-Q01** — "Bir ajansa bağlı mı?" sorusunda "Evet, Diğer." seçildiğinde ajans adı sorulmalı mı?
  - Kaynak: DOC-B — Alan 3
  - Etki / geçici davranış: Karar verilene kadar ek alan eklenmez.
- **T-Q02** — Kategori "Other" seçildiğinde açıklama alanı istenmeli mi?
  - Kaynak: DOC-B — Alan 6
  - Etki / geçici davranış: Karar verilene kadar ek alan eklenmez.
- **T-Q03** — "Cari Adı" serbest metin mi kalacak, yoksa kayıtlı cariler listesinden mi seçilecek? Carinin "sistemde kayıtlı" olup olmadığı nasıl kontrol edilecek? Formda Cari Hesap Açılış Talep Formu'na bağlantı verilecek mi (adresi nedir)?
  - Kaynak: DOC-B — Alan 7
  - Etki / geçici davranış: Karar verilene kadar serbest metin ve açıklama metni olarak kalır; otomatik kontrol uydurulmaz.
- **T-Q04** — Sosyal medya linklerinden en az birinin doldurulması zorunlu mu?
  - Kaynak: DOC-B — Alan 9–12
  - Etki / geçici davranış: Karar verilene kadar dördü de tamamen isteğe bağlıdır.
- **T-Q05** — Fotoğraf için hangi görsel biçimleri kabul edilecek (JPG, PNG, HEIC, WEBP…)? Fotoğraf nerede saklanacak ve ne için kullanılacak?
  - Kaynak: DOC-B — Alan 4
  - Etki / geçici davranış: Karar verilene kadar "image/*" kabul edilir.
- **T-Q07** — Mevcut form DOME alanında, oturum açmış Google hesabıyla çalışıyor ve ayrıca "Talebi Gönderen Kişi Mail" soruluyor. Formu yalnızca DOME personeli mi dolduracak? Yeni uygulamada kimlik doğrulama gerekecek mi; e-posta oturumdan otomatik alınabilir mi?
  - Kaynak: DOC-B — Üst kısım (oturum açık hesap, "Bu form DOME alanında oluşturuldu")
  - Etki / geçici davranış: Karar verilene kadar e-posta alanı elle doldurulur; kimlik doğrulama eklenmez.

### Her iki form (ortak)

- **S-002** — "İstisna Belgesi", "Serbest Meslek Makbuzu" ve "Gider Pusulası" iki formda da belge türü seçeneği olarak geçiyor. Cari Hesap Açılış Talep Formu'nda "İstisna Belgesi" seçimi ayrıca zorunlu bir belge yükleme sayfası açıyor; Yeni Talent Formu'nda bu seçeneklere bağlı bir davranış yok. İki form arasındaki ilişki (ör. aynı kavram mı, Talent formunda da belge istenmeli mi) belgelenmemiş.
  - Kaynak: DOC-A, DOC-D, DOC-B — DOC-A/DOC-D Cari formu belge türü seçenekleri ve "İstisna Belgesi" yükleme sayfası ↔ DOC-B Alan 8 "Belge Tipi" seçenekleri
  - Etki / geçici davranış: Karar verilene kadar iki form birbirinden bağımsız davranır; ek yükleme alanı veya formlar arası kural eklenmez.
- **S-003** — Cari formundaki "Talent / Influencer" kategorisi ile ayrı Yeni Talent Formu arasındaki ilişki belgelenmemiş (ör. bu kategori seçildiğinde Yeni Talent Formu'nun da doldurulması gerekir mi?).
  - Kaynak: DOC-A, DOC-C, DOC-B — DOC-A/DOC-C "Cari Türü" seçeneği "Talent / Influencer" ↔ DOC-B Yeni Talent Formu
  - Etki / geçici davranış: Karar verilene kadar formlar arası yönlendirme veya bağımlılık eklenmez.

## 4. Onayınızı bekleyen öneriler (belgede yok veya belge "olabilir" diyor) — 16

### Cari Form

- **C-040** — IBAN alanlarının yanına bir PDF yükleme alanı eklenmesi önerisi: vergi levhası ve firmanın banka bilgisinin imzalı şekilde yüklenmesi için.
  - Kaynak: DOC-C — DOC-C P014
  - Etki / geçici davranış: Not "yapabiliriz" diyor; öneri niteliğinde. Canlı formda (DOC-D) böyle bir alan yok. Onaylanırsa: dosya türü PDF.
  - Ayrıntı: Tek dosya mı (vergi levhası + banka bilgisi birlikte) yoksa iki ayrı yükleme mi? Zorunlu mu? Boyut sınırı? Her iki branşta mı? "İmzalı" şartı nasıl kontrol edilecek (yalnızca açıklama mı)?
- **C-P01** — E-posta format doğrulaması: Talebi Gönderen Personel, Yetkili Mail, Finans Mail alanları geçerli e-posta biçiminde olmalı.
  - Kaynak: ANALIZ — Belgede yok — alan adlarından çıkarım ("mail")
  - Etki / geçici davranış: Öneri durumundayken prototipte yalnızca uyarı (engellemez). Onaylanırsa hata olur. Canlı formdaki "metin içerir (boş)" kuralı bunu sağlamıyor (C-020).
  - Ayrıntı: Talebi Gönderen Personel için şirket alan adı (ör. @dome.istanbul) zorunlu mu?
- **C-P02** — Telefon format doğrulaması: yalnızca rakam, boşluk, "+", parantez ve tire; 10–15 rakam.
  - Kaynak: ANALIZ — Belgede yok
  - Etki / geçici davranış: Öneri durumundayken yalnızca uyarı.
  - Ayrıntı: Yurtdışı numaralar kabul edilecek mi?
- **C-P03** — Vergi Numarası / TC Kimlik No: yalnızca rakam; 10 hane (Vergi Kimlik No) veya 11 hane (TC Kimlik No).
  - Kaynak: ANALIZ — Belgede yok — alan etiketinden çıkarım
  - Etki / geçici davranış: Öneri durumundayken yalnızca uyarı. Canlı formda bu alan için yalnızca "en fazla 15 karakter" kuralı var (C-036); 10/11 hane kuralı yabancı vergi numaralarını reddeder (C-Q04). Algoritmik sağlama (checksum) önerilmiyor.
  - Ayrıntı: Kural yalnızca Ülke = Türkiye iken mi uygulanmalı?
- **C-P04** — IBAN format doğrulaması (ISO 13616, mod-97 kontrolü; boşluklar yok sayılır) — IBAN (TRY) ve doluysa IBAN (USD).
  - Kaynak: ANALIZ — Belgede yok
  - Etki / geçici davranış: Öneri durumundayken yalnızca uyarı.
  - Ayrıntı: IBAN (TRY) için "TR" ile başlama ve 26 karakter şartı da aranmalı mı?
- **C-P05** — Posta Kodu: 5 haneli rakam (Türkiye formatı).
  - Kaynak: ANALIZ — Belgede yok
  - Etki / geçici davranış: Öneri durumundayken yalnızca uyarı. Yurtdışı adresler için geçersiz olabilir (C-Q04).
- **C-P06** — Fatura yönü değiştirildiğinde, yeni branşta geçersiz kalan Cari Türü seçimi temizlenir ve kullanıcı bilgilendirilir. Diğer yanıtlar korunur.
  - Kaynak: ANALIZ — Belgede yok — C-002 sonucunda gerekli davranış
  - Etki / geçici davranış: Prototip bu davranışı uygular.
- **C-P07** — Gönderimden önce tüm yanıtların bölüm bölüm özetlendiği ve düzenlenebildiği bir "Gözden geçir" adımı.
  - Kaynak: ANALIZ — Belgede yok
  - Etki / geçici davranış: Google Forms'ta bu adım yok. Prototip bu adımı içerir.
- **C-P08** — Yalnızca boşluk karakterlerinden oluşan yanıtlar boş sayılır (zorunlu alan kontrolünde).
  - Kaynak: ANALIZ — Belgede yok
  - Etki / geçici davranış: Prototip bu davranışı uygular.
- **C-P09** — Prototip sunumu: "Sayfa 1/6" alanları belgedeki sırayla, görsel alt başlıklar altında gösterilir (Talep ve cari bilgileri · Adres bilgileri · Yetkili ve finans iletişim bilgileri · Banka bilgileri · Şirket / belge türü). Her alanın altında açıklama metni, hatada alanın altında kırmızı mesaj ve sayfa üstünde hata özeti gösterilir; ilk hatalı alana odaklanılır.
  - Kaynak: ANALIZ — Belgede yok — prototipte test edilen sunum
  - Etki / geçici davranış: Alan sırası ve metinler değişmez; yalnızca görsel gruplama ve hata sunumu eklenir.
- **C-P10** — TC Kimlik No: tam 11 hane, yalnızca rakam.
  - Kaynak: ANALIZ — Belgede yok — alan etiketinden çıkarım
  - Etki / geçici davranış: Öneri durumundayken yalnızca uyarı. Canlı formda yalnızca "en fazla 11 karakter" kuralı var (C-043). Algoritmik sağlama (checksum) önerilmiyor.

### Yeni Talent Form

- **T-P01** — E-posta format doğrulaması: "Talebi Gönderen Kişi Mail" geçerli e-posta biçiminde olmalı.
  - Kaynak: ANALIZ — Belgede yok — alan adından çıkarım ("Mail")
  - Etki / geçici davranış: Öneri durumundayken prototipte yalnızca uyarı (engellemez). Onaylanırsa hata olur.
  - Ayrıntı: Şirket alan adı (ör. @dome.istanbul) zorunlu mu?
- **T-P02** — Link alanları doluysa "http://" veya "https://" ile başlayan geçerli bir URL olmalı.
  - Kaynak: ANALIZ — Belgede yok
  - Etki / geçici davranış: Öneri durumundayken yalnızca uyarı. Platform alan adı eşleşmesi (instagram.com vb.) önerilmiyor; kısa linkler (youtu.be) nedeniyle yanlış red riski var.
- **T-P03** — Yalnızca boşluk karakterlerinden oluşan yanıtlar boş sayılır (zorunlu alan kontrolünde).
  - Kaynak: ANALIZ — Belgede yok
  - Etki / geçici davranış: Prototip bu davranışı uygular.
- **T-P04** — Gönderimden önce tüm yanıtların özetlendiği ve düzenlenebildiği bir "Gözden geçir" adımı.
  - Kaynak: ANALIZ — Belgede yok
  - Etki / geçici davranış: Google Forms'ta bu adım yok. Prototip bu adımı içerir.
- **T-P05** — Prototip sunumu: alanlar belgedeki sırayla, görsel alt başlıklar altında gösterilir (Talep sahibi · Talent bilgileri · Cari ve belge bilgileri · Sosyal medya hesapları). Hatada alanın altında kırmızı mesaj ve form üstünde hata özeti gösterilir; ilk hatalı alana odaklanılır.
  - Kaynak: ANALIZ — Belgede yok — prototipte test edilen sunum
  - Etki / geçici davranış: Alan sırası ve metinler değişmez; yalnızca görsel gruplama ve hata sunumu eklenir.

