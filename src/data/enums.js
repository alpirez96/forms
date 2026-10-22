// Uygulama genelinde kullanılan sabit listeler (Türkçe etiketleriyle).

export const SOURCES = {
  'DOC-A': {
    id: 'DOC-A',
    file: 'CARI__AC_ILIS__FORMU_MERGED.pdf',
    title: 'Cari Hesap Açılış Talep Formu – birleştirilmiş ekran görüntüleri (PDF)',
    summary:
      'Google Forms üzerindeki mevcut "Cari Hesap Açılış Talep Formu"nun 5 PDF sayfalık ekran görüntüsü. ' +
      'PDF sayfa 1–2 = form sayfası 1/6, PDF sayfa 3 = 2/6, PDF sayfa 4 = 5/6, PDF sayfa 5 = 6/6. ' +
      'Form sayfaları 3/6 ve 4/6 belgede yer almıyor. Alanlara test amaçlı değerler girilmiş; bu değerler gereksinim değildir.',
    shortSummary: 'Ayrı "Cari Hesap Açılış Talep Formu"nun ekran görüntüleri.',
    forms: ['cari'],
  },
  'DOC-B': {
    id: 'DOC-B',
    file: 'Yeni_Talent_Formu_MERGED.pdf',
    title: 'Yeni Talent Formu – ekran görüntüsü ve seçenek notları (PDF)',
    summary:
      'Google Forms üzerindeki "Yeni Talent Formu"nun tek sayfalık ekran görüntüsü. Sağ tarafta kırmızı oklarla ' +
      '"Kategori – Seçenekler" ve "Belge Tipi – Seçenekler" açılır listeleri gösterilmiş.',
    shortSummary: 'Ayrı "Yeni Talent Formu"nun ekran görüntüsü.',
    forms: ['talent'],
  },
  'DOC-C': {
    id: 'DOC-C',
    file: 'CARI__AC_ILIS__FORMU-_O_RNEK_S_ABLON.docx',
    title: 'Cari Açılış Formu – Örnek Şablon (DOCX, değişiklik notları)',
    summary:
      'Cari formunun 5 ekran görüntüsü ve aralarında kırmızı-kalın yazılmış değişiklik notları (P002, P004–P012, P014). ' +
      'Word yorumu veya izlenen değişiklik içermez. Notlar muhasebe ekibinin form tasarımına yönelik değişiklik talepleridir.',
    shortSummary: 'Ayrı "Cari Hesap Açılış Talep Formu" için değişiklik notları içeren şablon.',
    forms: ['cari'],
  },
  BRIEF: {
    id: 'BRIEF',
    file: '—',
    title: 'Proje brifi (kullanıcı talimatı)',
    summary:
      'Bu prototipi isteyen proje brifi. Cari Form için ilk sorunun "Fatura mı keseceğim, bana fatura mı kesilecek?" ' +
      'olmasını ve iki seçeneğin "Fatura keseceğim" / "Bana fatura kesilecek" olmasını zorunlu kılar.',
    forms: ['cari', 'talent'],
  },
  ANALIZ: {
    id: 'ANALIZ',
    file: '—',
    title: 'Analist önerisi (kaynak belgelerde yok)',
    summary:
      'Belgelerde tanımlı olmayan, yalnızca öneri olarak sunulan maddeler. Onaylanmadıkça gereksinim sayılmaz.',
    forms: ['cari', 'talent'],
  },
};

// Gereksinim inceleme durumları.
export const STATUS = {
  'kaynak-onayli': { label: 'Kaynakla doğrulandı', short: 'Kaynak', tone: 'green' },
  'test-onayli': { label: 'Testte benim onayım', short: 'Onaylı', tone: 'blue' },
  oneri: { label: 'Önerilen iyileştirme', short: 'Öneri', tone: 'purple' },
  'acik-soru': { label: 'Açık soru', short: 'Açık soru', tone: 'amber' },
  ertelendi: { label: 'Ertelenen karar', short: 'Ertelendi', tone: 'gray' },
  reddedildi: { label: 'Reddedildi / kapsam dışı', short: 'Reddedildi', tone: 'red' },
};

// Prompt ve prototip için "zorunlu uygulanacak" sayılan durumlar.
export const MANDATORY_STATUSES = ['kaynak-onayli', 'test-onayli'];

export const CONFIDENCE = {
  explicit: { label: 'Açıkça belgelenmiş', tone: 'green' },
  implied: { label: 'Güçlü çıkarım', tone: 'blue' },
  unclear: { label: 'Belirsiz', tone: 'amber' },
};

export const REQ_TYPES = {
  functional: 'İşlevsel',
  ux: 'Kullanıcı deneyimi',
  validation: 'Doğrulama',
  business: 'İş kuralı',
  content: 'İçerik',
  technical: 'Teknik',
  unresolved: 'Çözümsüz / açık',
};

export const FORM_LABELS = {
  cari: 'Cari Form',
  talent: 'Yeni Talent Form',
  both: 'Her iki form (ortak)',
};

export const BRANCHES = {
  issue: 'Fatura keseceğim',
  receive: 'Bana fatura kesilecek',
};

// Geri bildirim / karar kapsamı (yalnızca Cari Form için).
export const BRANCH_SCOPES = {
  all: 'Her iki branş',
  issue: 'Fatura keseceğim',
  receive: 'Bana fatura kesilecek',
};

export const FEEDBACK_CATEGORIES = {
  'eksik-alan': 'Eksik alan',
  'gereksiz-alan': 'Gereksiz alan',
  'yanlis-etiket': 'Hatalı alan etiketi veya açıklaması',
  'kosul-hatasi': 'Hatalı koşullu davranış',
  'dogrulama': 'Hatalı veya eksik doğrulama',
  'kafa-karistirici': 'Kafa karıştırıcı kullanıcı deneyimi',
  'is-kurali': 'Eksik iş kuralı',
  'celiski': 'Belge çelişkisi',
  'teknik': 'Teknik gereksinim',
  'diger': 'Diğer',
};

export const FEEDBACK_STATUS = {
  acik: 'Açık',
  cozuldu: 'Çözüldü',
  ertelendi: 'Ertelendi',
};

export const PRIORITIES = {
  '': 'Belirtilmedi',
  dusuk: 'Düşük',
  orta: 'Orta',
  yuksek: 'Yüksek',
  kritik: 'Kritik',
};

export const FIELD_TYPES = {
  text: 'Kısa metin',
  textarea: 'Uzun metin',
  radio: 'Tek seçim (radyo)',
  select: 'Açılır liste',
  file: 'Dosya yükleme',
};

// Belge talimatlarının hedef kitlesi.
export const AUDIENCES = {
  doldurana: 'Formu dolduran kişiye yönelik metin',
  'ekip-notu': 'Muhasebe ekibinin değişiklik notu (tasarım/geliştirme)',
  'belge-notu': 'Belgeyi hazırlayanın açıklama notu (seçenekleri gösterir)',
  platform: 'Google Forms platform metni',
  brif: 'Proje brifi',
  'test-verisi': 'Ekran görüntüsündeki test verisi (gereksinim değil)',
};

export const REQUIRED_MESSAGE = 'Bu, yanıtlanması zorunlu bir sorudur';
export const DEFAULT_PLACEHOLDER = 'Yanıtınız';
export const SELECT_PLACEHOLDER = 'Seçin';
