# Yeni Talent Formu

Bu metin, "Yeni Talent Formu"nun nasıl olması gerektiğini anlatır. Tırnak içindeki metinler ekranda birebir bu şekilde yer alır.

## 1. Amaç

Form, yeni bir talentin (içerik üreticisi / influencer) bilgilerini toplar: talebi gönderen kişi, talentin adı ve nickname'i, ajans bağlantısı, fotoğrafı, kategorisi, cari adı, belge tipi ve sosyal medya bağlantıları. Form şu anda Google Forms'ta çalışıyor. Aşağıdaki tarif mevcut formu ve test edilen deneyimi birlikte içerir.

## 2. Formun üst kısmı

- Başlık: "Yeni Talent Formu"
- "* Zorunlu soruyu belirtir" açıklaması bulunur. Zorunlu soruların etiketinin sonunda kırmızı "*" vardır.

## 3. Akış

1. Tüm sorular tek sayfada, Bölüm 4'teki sırayla gösterilir. Üstte iki adımlı bir ilerleme göstergesi bulunur: form ve "Gözden geçir" ("Adım X / 2").
2. Sayfanın altındaki "Gözden geçir" düğmesi tüm soruları kontrol eder. Hata yoksa gözden geçirme adımına geçilir.
3. **Son adım: "Gözden geçir ve gönder".** "Yanıtlarınızı kontrol edin. Değiştirmek için ilgili bölümde "Düzenle"yi kullanın." metninin altında tüm sorular ve yanıtları liste olarak gösterilir. Boş yanıtlar "—" olarak görünür. "Düzenle" forma döndürür; yanıtlar korunur. Bu adımda "Geri" ve "Gönder" düğmeleri bulunur.
4. Gönderimden sonra gösterilecek mesaj henüz belli değil (bkz. Bölüm 6).
5. **"Formu temizle":** her adımın altında bulunur. "Bu formdaki tüm yanıtlar silinsin mi?" onayından sonra tüm yanıtlar silinir.

## 4. Sorular

Kısa metin sorularında yer tutucu "Yanıtınız", açılır listelerin ilk satırı "Seçin"dir. Sorular dört alt başlık altında gruplanır.

**Talep sahibi**

1. "Talebi Gönderen Kişi Mail" — kısa metin, zorunlu.

**Talent bilgileri**

2. "Talent İsim Soyisim" — kısa metin, zorunlu. Açıklama: "Örnek: Berk Keklik"
3. "Bir ajansa bağlı mı?" — tek seçim, zorunlu. Seçenekler: "Evet, Dome / TEM", "Evet, Diğer.", "Hayır".
4. "Fotoğraf" — dosya yükleme, zorunlu; en fazla 1 dosya, en fazla 10 MB, yalnızca görsel. Açıklama: "Desteklenen 1 dosya yükleyebilirsiniz: image. En fazla 10 MB olmalıdır." Dosya "Dosya ekle" düğmesiyle seçilir. Seçilen dosyanın adı ve boyutu görünür; "Dosyayı değiştir" ile değiştirilir, "Kaldır" ile kaldırılır.
5. "Talent Nickname" — kısa metin, zorunlu. Açıklama: "Örnek: Uberkuloz"
6. "Kategori" — açılır liste, zorunlu. Seçenekler: "Lifestyle", "Entertainment", "Technology", "Gaming", "Sports", "Other".

**Cari ve belge bilgileri**

7. "Cari Adı" — kısa metin, zorunlu. Açıklama: "Eğer carisi sistemde kayıtlı değilse cari formu da doldurulmalıdır."
8. "Belge Tipi" — açılır liste, zorunlu. Seçenekler: "E-Fatura", "E-Arşiv", "Gider Pusulası", "Serbest Meslek Makbuzu", "İstisna Belgesi".

**Sosyal medya hesapları**

9. "Instagram Link" — kısa metin, isteğe bağlı.
10. "YouTube Link" — kısa metin, isteğe bağlı.
11. "TikTok Link" — kısa metin, isteğe bağlı.
12. "Twitch Link" — kısa metin, isteğe bağlı.

## 5. Doğrulama ve hata mesajları

- Zorunlu bir soru boş bırakılırsa ilerlenemez ve form gönderilemez. Soru kırmızı çerçeveyle vurgulanır ve altında "Bu, yanıtlanması zorunlu bir sorudur" yazar.
- Yalnızca boşluk karakterlerinden oluşan yanıt boş sayılır.
- "Fotoğraf": 10 MB'tan büyük dosyayla ilerlenemez ("Dosya en fazla 10 MB olmalıdır."). Görsel olmayan dosyayla da ilerlenemez ("Yalnızca görsel (image) dosyası yükleyebilirsiniz.").
- Hatalar kullanıcı ilerlemeyi denediğinde gösterilir ve düzeltildikçe kalkar. Formun üstünde "Lütfen N hatayı düzeltin" başlıklı bir özet çıkar; her madde ilgili soruya götürür. İmleç ilk hatalı soruya gelir.
- Bunların dışında biçim kontrolü yoktur (bkz. Bölüm 6).

## 6. Netleşmemiş konular

Bunlar henüz kararlaştırılmadı. Karar verilene kadar "Şimdilik" yazan hâl geçerlidir. Parantez içindeki kodlar, cevap geldiğinde konuyu bulmak içindir.

- Gönderilen talepler (yanıtlar ve fotoğraf) kime ulaşmalı, kimler bilgilendirilmeli? Gönderimden sonra kullanıcıya hangi mesaj gösterilmeli? Şimdilik belirlenmedi. (T-Q06)
- Formu yalnızca DOME personeli mi dolduracak? Mevcut form DOME'un Google hesabıyla oturum açılarak dolduruluyor; ayrıca "Talebi Gönderen Kişi Mail" soruluyor. Şimdilik "Talebi Gönderen Kişi Mail" sorusu formda kalır. (T-Q07)
- "Cari Adı" serbest metin mi kalacak, yoksa kayıtlı cariler listesinden mi seçilecek? Carinin sistemde kayıtlı olup olmadığı kontrol edilecek mi? Formda Cari Hesap Açılış Talep Formu'na bağlantı verilecek mi (adresi nedir)? Şimdilik serbest metin; açıklama dışında kontrol veya bağlantı yok. (T-Q03)
- "Bir ajansa bağlı mı?" sorusunda "Evet, Diğer." seçilirse ajans adı sorulmalı mı? Şimdilik ek soru yok. (T-Q01)
- "Kategori"de "Other" seçilirse açıklama istenmeli mi? Şimdilik ek soru yok. (T-Q02)
- Sosyal medya linklerinden en az birinin doldurulması zorunlu mu? Şimdilik dördü de isteğe bağlı. (T-Q04)
- Fotoğraf için hangi görsel biçimleri kabul edilecek (JPG, PNG, HEIC, WEBP…)? Fotoğraf ne için kullanılacak? Şimdilik her görsel türü kabul edilir. (T-Q05)
- "Talebi Gönderen Kişi Mail" ve link soruları için biçim kontrolü (geçerli e-posta; "http://" veya "https://" ile başlayan link) yapılacak mı? Şimdilik yok. (T-P01, T-P02)
- "İstisna Belgesi", "Serbest Meslek Makbuzu" ve "Gider Pusulası" ayrı Cari Hesap Açılış Talep Formu'nda da geçiyor; orada "İstisna Belgesi" seçilince belge yükleme sayfası açılıyor. Bu formda da belge istenmeli mi? Şimdilik "Belge Tipi" seçimine bağlı ek soru yok. (S-002)
- Cari Hesap Açılış Talep Formu'nda "Talent / Influencer" kategorisi seçildiğinde bu formun da doldurulması gerekiyor mu? Şimdilik formlar arasında bağlantı yok. (S-003)
