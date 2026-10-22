# Cari Hesap Açılış Talep Formu

Bu metin, "Cari Hesap Açılış Talep Formu"nun nasıl olması gerektiğini anlatır. Tırnak içindeki metinler ekranda birebir bu şekilde yer alır.

## 1. Amaç

Form, tedarikçi veya müşteri olarak sisteme eklenecek carinin (cari hesabın) bilgilerini toplar. Form şu anda Google Forms'ta çalışıyor. Aşağıdaki tarif mevcut formu ve kararlaştırılan değişiklikleri birlikte içerir.

En önemli değişiklik: form, diğer bütün sorulardan önce "Fatura mı keseceğim, bana fatura mı kesilecek?" sorusuyla başlar. Verilen yanıt, "Cari Türü" sorusunun seçeneklerini belirler.

## 2. Formun üst kısmı

- Başlık: "Cari Hesap Açılış Talep Formu"
- Giriş metni: "Sistemimize tedarikçi veya müşteri olarak eklenmeniz ve faturalarınızın zamanında işleme alınabilmesi için bu formda gereken tüm bilgileri doğru şekilde doldurmanızı rica ederiz."
- Kalın başlık "Fatura Süreçleri Hakkında Önemli Bilgilendirme:" ve altında iki madde:
  - Kalın "PO Numarası Zorunluluğu:", ardından: "Tüm tedarikçi faturalarında "E" harfi ile başlayan geçerli bir Satın Alma Sipariş (PO) numarası bulunmalıdır. PO numarası içermeyen faturalar kabul edilmeyecek ve ödeme süreci başlatılmadan iade edilecektir."
  - Kalın "Fatura Gönderimi:", ardından: "E-arşiv ve kağıt faturalarınızı lütfen PDF formatında ilgili e-posta adreslerimize iletiniz:" Altında tıklanınca e-posta açan finans@dome.istanbul bağlantısı bulunur.
- Gizlilik metni "Bu formu doldurarak " ile başlar; devamı bağlantıdır: "bu linkten ulaşabileceğiniz gizlilik politikamızı kabul etmiş sayılırsınız." Bağlantı çalışan bir gizlilik politikası sayfasını açmalıdır. Mevcut formdaki adres (https://dome.istanbul/privacy-policy) boş sayfa açıyor; doğru adres henüz belli değil (bkz. Bölüm 7).
- "* Zorunlu soruyu belirtir" açıklaması bulunur. Zorunlu soruların etiketinin sonunda kırmızı "*" vardır.
- Üst kısım ilk adımda tam gösterilir. Sonraki adımlarda yalnızca form başlığı görünür.

## 3. Akış

1. **İlk adım: fatura yönü.** Bu adımda yalnızca "Fatura mı keseceğim, bana fatura mı kesilecek?" sorusu iki büyük seçenek kartıyla gösterilir: "Fatura keseceğim" ve "Bana fatura kesilecek". Soru zorunludur; yanıtlanmadan diğer sorular gösterilmez ve ilerlenemez.
2. Sonraki her adımda üstte seçilen yön "Fatura yönü: Fatura keseceğim" biçiminde görünür. Yanındaki "Değiştir" ilk adıma döndürür.
3. Ardından **Sayfa 1/6 — Temel bilgiler** gelir (sorular Bölüm 4'te).
4. Sonraki sayfalar "Şirket/Belge Türü" yanıtına göre belirlenir:
   - "Limited / Anonim Şirketi" veya "Şahıs Firması": Sayfa 2/6 (Vergi Numarası / TC Kimlik No) → Sayfa 4/6 (Vergi Dairesi) → gönderim
   - "İstisna Belgesi": Sayfa 5/6 (İstisna Belgesi) → Sayfa 3/6 (TC Kimlik No) → gönderim
   - "Serbest Meslek Makbuzu" veya "Gider Pusulası": Sayfa 3/6 (TC Kimlik No) → gönderim

   Yolda olmayan sayfalar gösterilmez ve o sayfalardaki yanıtlar gönderilmez. Kullanıcı geri dönüp seçimini değiştirirse yol yeniden belirlenir. Yönlendirme iki fatura yönünde de aynıdır. Mevcut formdaki 6. bölüm ("Submit") soru içermeyen teknik bir bölümdür; hiçbir yolda gösterilmez.
5. **İlerleme göstergesi:** her adımın üstünde, izlenen yoldaki adımlar adlarıyla ve "Adım X / N" sayacıyla görünür. "Şirket/Belge Türü" yanıtlanana kadar ilk sayfadan sonra "Sonraki sayfalar "Şirket/Belge Türü" yanıtına göre belirlenir" yazar. Daha önce ulaşılan adımlara göstergeden dönülebilir.
6. **Düğmeler:** sayfaların altında "Geri" ve ileri düğmesi bulunur. İleri düğmesinde, sıradaki adım bir sayfaysa "Sonraki", gözden geçirme adımıysa "Gözden geçir" yazar. İleri düğmesi yalnızca o sayfadaki yanıtlar geçerliyse ilerler. "Geri" kontrol yapmadan önceki adıma döner; girilen yanıtlar korunur.
7. **Son adım: "Gözden geçir ve gönder".** "Yanıtlarınızı kontrol edin. Değiştirmek için ilgili bölümde "Düzenle"yi kullanın." metninin altında önce fatura yönü, sonra izlenen yoldaki sayfalar yol sırasıyla, soru ve yanıt listesi olarak gösterilir. Boş yanıtlar "—" olarak görünür. Her bölümdeki "Düzenle" ilgili adıma döndürür; yanıtlar korunur. "Gönder" düğmesi bu adımdadır. Gönderimde yoldaki bütün adımlar yeniden kontrol edilir; hata varsa form gönderilmez ve ilk hatalı adıma dönülür.
8. **Gönderimden sonra:** "Teşekkürler. Cari Talebiniz Alınmıştır." mesajı gösterilir.
9. **"Formu temizle":** her adımın altında bulunur. "Bu formdaki tüm yanıtlar silinsin mi?" onayından sonra tüm yanıtlar silinir ve form ilk adıma döner.

## 4. Sorular

Kısa metin sorularında yer tutucu "Yanıtınız", açılır listelerin ilk satırı "Seçin"dir.

### İlk adım

1. "Fatura mı keseceğim, bana fatura mı kesilecek?" — tek seçim, zorunlu. Seçenekler: "Fatura keseceğim", "Bana fatura kesilecek".

### Sayfa 1/6 — Temel bilgiler

Sorular beş alt başlık altında gruplanır.

**Talep ve cari bilgileri**

1. "Talebi Gönderen Personel" — kısa metin, zorunlu. Açıklama: "Şirket mailiniz"
2. "Cari Türü" — tek seçim, isteğe bağlı. Seçim yapılınca "Seçimi temizle" ile kaldırılabilir. Açıklama ve seçenekler fatura yönüne göre değişir:
   - "Fatura keseceğim" seçildiyse açıklama "Fatura kesecekseniz aşağıdaki kategorilerden birini seçin lütfen.", seçenekler "Genel Tedarikçi", "Satıcı (Ajans)", "Yurtdışı Satıcı (Ajans)", "Talent / Influencer".
   - "Bana fatura kesilecek" seçildiyse açıklama "Size fatura keseceksek aşağıdaki kategorilerden birini seçin lütfen.", seçenekler "Müşteri", "Yurtdışı Müşteri".
   - Mevcut formdaki "Marka" ve "Ajans" seçenekleri kaldırılır.
3. "Cari Hesap Adı" — kısa metin, zorunlu. Açıklama: "Örnek: DOME MEDYA VE İLETİŞİM ANONİM ŞİRKETİ"
4. "Nickname" — kısa metin, zorunlu. Açıklama: "Örnek: Dome İstanbul"

**Adres bilgileri**

5. "Ülke" — açılır liste, zorunlu. Seçenekler: "Türkiye", "Amerika Birleşik Devletleri", "Birleşik Krallık", "Çin", "Diğer".
6. "İl ve İlçe" — uzun metin (paragraf), zorunlu.
7. "Adres" — uzun metin (paragraf), zorunlu.
8. "Posta Kodu" — kısa metin, zorunlu.

**Yetkili ve finans iletişim bilgileri**

9. "Yetkili Adı Soyadı" — kısa metin, zorunlu.
10. "Yetkili Telefon No" — kısa metin, zorunlu.
11. "Yetkili Mail" — kısa metin, zorunlu.
12. "Finans Mail" — kısa metin, zorunlu.
13. "Finans Telefon No" — kısa metin, zorunlu.

**Banka bilgileri**

14. "IBAN (TRY)" — kısa metin, zorunlu.
15. "IBAN (USD)" — kısa metin, isteğe bağlı.

**Şirket / belge türü**

16. "Şirket/Belge Türü" — açılır liste, zorunlu. Seçenekler: "Limited / Anonim Şirketi", "Şahıs Firması", "İstisna Belgesi", "Serbest Meslek Makbuzu", "Gider Pusulası". Yanıt sonraki sayfaları belirler (Bölüm 3).

### Sayfa 2/6 — Vergi Bilgileri - Vergi Numarası / TC Kimlik No

Yalnızca "Limited / Anonim Şirketi" veya "Şahıs Firması" seçildiyse gösterilir.

1. "Vergi Numarası / TC Kimlik No" — kısa metin, zorunlu, en fazla 15 karakter.

### Sayfa 3/6 — TC Kimlik No

Yalnızca "İstisna Belgesi", "Serbest Meslek Makbuzu" veya "Gider Pusulası" seçildiyse gösterilir.

1. "TC Kimlik No" — kısa metin, zorunlu, en fazla 11 karakter.

### Sayfa 4/6 — Vergi Bilgileri - Vergi Dairesi

Yalnızca "Limited / Anonim Şirketi" veya "Şahıs Firması" seçildiyse gösterilir.

1. "Vergi Dairesi" — kısa metin, zorunlu.

### Sayfa 5/6 — İstisna Belgesi

Yalnızca "İstisna Belgesi" seçildiyse gösterilir.

1. "İstisna Belgesi" — dosya yükleme, zorunlu; en fazla 1 dosya, en fazla 10 MB. Açıklama: "Desteklenen 1 dosya yükleyebilirsiniz. En fazla 10 MB olmalıdır." Dosya "Dosya ekle" düğmesiyle seçilir. Seçilen dosyanın adı ve boyutu görünür; "Dosyayı değiştir" ile değiştirilir, "Kaldır" ile kaldırılır.

## 5. Fatura yönüne göre farklar

- "Cari Türü" sorusunun açıklaması ve seçenekleri yöne göre değişir (Bölüm 4).
- Bunun dışında iki yönde sorular, zorunluluklar ve sayfa yönlendirmesi aynıdır.
- Yön değiştirildiğinde, yeni yönde geçerli olmayan "Cari Türü" seçimi silinir ve ""Cari Türü" seçimi yeni fatura yönünde geçerli olmadığı için temizlendi." uyarısı gösterilir. Diğer yanıtlar korunur.

## 6. Doğrulama ve hata mesajları

- Zorunlu bir soru boş bırakılırsa ilerlenemez. Soru kırmızı çerçeveyle vurgulanır ve altında "Bu, yanıtlanması zorunlu bir sorudur" yazar.
- Yalnızca boşluk karakterlerinden oluşan yanıt boş sayılır.
- "Vergi Numarası / TC Kimlik No" en fazla 15, "TC Kimlik No" en fazla 11 karakter alır. Fazlası girilirse sorunun altında "Bu alana en fazla 15 karakter girilebilir." (TC Kimlik No için 11) yazar ve ilerlenemez.
- "İstisna Belgesi": 10 MB'tan büyük dosyayla ilerlenemez; "Dosya en fazla 10 MB olmalıdır." yazar.
- Hatalar kullanıcı ilerlemeyi denediğinde gösterilir ve düzeltildikçe kalkar. Sayfanın üstünde "Lütfen N hatayı düzeltin" başlıklı bir özet çıkar; her madde ilgili soruya götürür. İmleç ilk hatalı soruya gelir.
- Bunların dışında biçim kontrolü yoktur (bkz. Bölüm 7).

## 7. Netleşmemiş konular

Bunlar henüz kararlaştırılmadı. Karar verilene kadar "Şimdilik" yazan hâl geçerlidir. Parantez içindeki kodlar, cevap geldiğinde konuyu bulmak içindir.

- Gönderilen talepler (yanıtlar ve yüklenen dosyalar) kime ulaşmalı, kimler bilgilendirilmeli? Şimdilik belirlenmedi. (C-Q09)
- Formu kim dolduruyor: karşı taraf (tedarikçi/müşteri) mı, DOME personeli mi? Giriş metni karşı tarafa hitap ediyor; "Talebi Gönderen Personel" sorusu ("Şirket mailiniz") ise personelin doldurduğunu düşündürüyor. İlk sorunun kimin ağzından sorulduğu ve metinlerin hitabı buna bağlı. Şimdilik metinler mevcut formdaki gibi kalır. (C-Q06)
- İki fatura yönü arasında kategori listesi dışında fark olacak mı? Özellikle "Bana fatura kesilecek" yönünde: "IBAN (TRY)" zorunlu kalacak mı, "Fatura Süreçleri Hakkında Önemli Bilgilendirme" gösterilecek mi, "Şirket/Belge Türü" seçenekleri ve sayfa yönlendirmesi aynı mı kalacak? Şimdilik kategori listesi dışında iki yön aynıdır. (C-Q05)
- Yurtdışı cariler ("Yurtdışı Satıcı (Ajans)", "Yurtdışı Müşteri" ve Türkiye dışındaki ülkeler) için hangi sorular zorunlu, isteğe bağlı veya gizli olmalı? Ülke listesi genişletilecek mi? Şimdilik ülke ve kategori seçimi hiçbir soruyu değiştirmez. (C-Q04)
- "Cari Türü" zorunlu olacak mı? Şimdilik isteğe bağlı (mevcut formdaki gibi). (C-Q11)
- Gizlilik politikası bağlantısı hangi adrese gitmeli? Doğru adres başka mı, yoksa mevcut adresteki sayfa mı düzeltilecek? Şimdilik mevcut adres kullanılır. (C-Q07)
- "İstisna Belgesi" için hangi dosya türleri kabul edilecek? Şimdilik tür sınırı yok; yalnızca 1 dosya ve 10 MB sınırı var. (C-Q12)
- E-posta, telefon, IBAN, posta kodu, Vergi Numarası ve TC Kimlik No soruları için biçim kontrolü (ör. geçerli e-posta, geçerli IBAN, 11 haneli TC Kimlik No) yapılacak mı? Şimdilik yalnızca zorunluluk ve uzunluk kontrolleri var. (C-P01–C-P05, C-P10)
- Değişiklik notlarında, IBAN sorularının yanına vergi levhası ve firmanın imzalı banka bilgisi için bir PDF yükleme alanı önerildi; karar verilmedi. Şimdilik bu alan yok. (C-040)
- Değişiklik notlarında "Vergi Numarası / TC Kimlik No" ve "Vergi Dairesi" sayfaları açıklamasız yer alıyor. Bu sayfalarda bir değişiklik (ör. iki vergi sorusunun tek sayfada birleşmesi) isteniyor mu? Şimdilik sayfa yapısı mevcut formdaki gibi. (C-Q10)
- "Cari Türü"nde "Talent / Influencer" seçildiğinde ayrı "Yeni Talent Formu"nun da doldurulması gerekiyor mu? Şimdilik formlar arasında bağlantı yok. (S-003)
- "İstisna Belgesi", "Serbest Meslek Makbuzu" ve "Gider Pusulası" ayrı "Yeni Talent Formu"nda da belge tipi olarak geçiyor; iki form arasındaki ilişki belirsiz. Şimdilik bu formdaki seçenekler ve yönlendirme diğer formdan bağımsızdır. (S-002)
- Bu tarif canlı formun güncel yapısını esas alır ("Vergi Dairesi" sayfası 4/6). Formun eski ekran görüntülerinde bu sayfa 6/6 görünüyordu; güncel yapının bu olduğu teyit edilmedi. (C-Q13)
