// İki formu birlikte ilgilendiren (belgelerde gerçekten ortak geçen) maddeler.
// Her biri her iki prompta da kendi başına anlaşılır biçimde eklenir.

export default [
  {
    id: 'S-001',
    form: 'both',
    source: ['DOC-B'],
    ref: 'DOC-B Alan 7 "Cari Adı" açıklaması',
    description:
      'Yeni Talent Formu, talentin carisi sistemde kayıtlı değilse ayrı "Cari Hesap Açılış Talep Formu"nun da doldurulmasını şart koşar ("Eğer carisi sistemde kayıtlı değilse cari formu da doldurulmalıdır.").',
    type: 'business',
    confidence: 'explicit',
    implications:
      'İki form ayrı sistemlerdir; bu kural birini diğerine bağımlı kılan otomatik bir kontrol tanımlamaz (kontrol mekanizması açık soru).',
    implicationsByForm: {
      cari: 'Bu formun yapısını değiştirmez; formun sistemde kayıtlı olmayan talent carileri için de doldurulduğunu gösterir. Yeni Talent Formu ile otomatik bağlantı, kontrol veya veri aktarımı kurma.',
      talent: '"Cari Adı" alanının açıklaması olarak birebir korunur. Cari Hesap Açılış Talep Formu ayrı bir sistemdir; otomatik kontrol veya bağımlılık kurma (kontrol mekanizması açık soru: T-Q03).',
    },
    openQuestions: '',
    openQuestionsByForm: { talent: 'Cari formuna bağlantı verilecek mi? Kayıtlı cari kontrolü nasıl yapılacak? (T-Q03)' },
    fields: { talent: ['cariAdi'], cari: [] },
    defaultStatus: 'kaynak-onayli',
  },
  {
    id: 'S-002',
    form: 'both',
    source: ['DOC-A', 'DOC-B'],
    ref: 'DOC-A Sayfa 5/6 "İstisna Belgesi" (zorunlu yükleme) ↔ DOC-B Alan 8 "Belge Tipi" seçeneği "İstisna Belgesi"',
    description:
      '"İstisna Belgesi" iki formda da geçiyor: Cari Hesap Açılış Talep Formu\'nda zorunlu dosya yükleme sayfası olarak; Yeni Talent Formu\'nda "Belge Tipi" seçeneği olarak. İki kullanım arasındaki ilişki (ör. Talent formunda bu seçenek seçilince belge yüklemesi istenmesi) belgelenmemiş.',
    type: 'unresolved',
    confidence: 'unclear',
    implications: 'Karar verilene kadar iki form birbirinden bağımsız davranır; ek yükleme alanı veya formlar arası kural eklenmez.',
    openQuestions: '',
    fields: { talent: ['belgeTipi'], cari: ['istisnaBelgesi'] },
    defaultStatus: 'acik-soru',
  },
  {
    id: 'S-003',
    form: 'both',
    source: ['DOC-A', 'DOC-C', 'DOC-B'],
    ref: 'DOC-A/DOC-C "Cari Türü" seçeneği "Talent / Influencer" ↔ DOC-B Yeni Talent Formu',
    description:
      'Cari formundaki "Talent / Influencer" kategorisi ile ayrı Yeni Talent Formu arasındaki ilişki belgelenmemiş (ör. bu kategori seçildiğinde Yeni Talent Formu\'nun da doldurulması gerekir mi?).',
    type: 'unresolved',
    confidence: 'unclear',
    implications: 'Karar verilene kadar formlar arası yönlendirme veya bağımlılık eklenmez.',
    openQuestions: '',
    fields: { talent: [], cari: ['cariTuru'] },
    defaultStatus: 'acik-soru',
  },
];
