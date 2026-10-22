// İki formu birlikte ilgilendiren (belgelerde gerçekten ortak geçen) maddeler.
// Her biri iki formun envanterinde de kendi başına anlaşılır biçimde yer alır.

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
    openQuestionsByForm: { talent: 'Cari formuna bağlantı verilecek mi? Kayıtlı cari kontrolü yapılacak mı? (T-Q03)' },
    fields: { talent: ['cariAdi'], cari: [] },
    defaultStatus: 'kaynak-onayli',
  },
  {
    id: 'S-002',
    form: 'both',
    source: ['DOC-A', 'DOC-D', 'DOC-B'],
    ref: 'DOC-A/DOC-D Cari formu belge türü seçenekleri ve "İstisna Belgesi" yükleme sayfası ↔ DOC-B Alan 8 "Belge Tipi" seçenekleri',
    description:
      '"İstisna Belgesi", "Serbest Meslek Makbuzu" ve "Gider Pusulası" iki formda da belge türü seçeneği olarak geçiyor. Cari Hesap Açılış Talep Formu\'nda "İstisna Belgesi" seçimi ayrıca zorunlu bir belge yükleme sayfası açıyor; Yeni Talent Formu\'nda bu seçeneklere bağlı bir davranış yok. İki form arasındaki ilişki (ör. aynı kavram mı, Talent formunda da belge istenmeli mi) belgelenmemiş.',
    type: 'unresolved',
    confidence: 'unclear',
    implications: 'Karar verilene kadar iki form birbirinden bağımsız davranır; ek yükleme alanı veya formlar arası kural eklenmez.',
    implicationsByForm: {
      cari: 'Bu formda bu türler "Şirket/Belge Türü" seçenekleridir ve sayfa yönlendirmesini belirler (C-041). Yeni Talent Formu ile otomatik bağlantı kurma.',
      talent: 'Bu formda bu türler "Belge Tipi" seçenekleridir ve koşullu davranış yoktur. Karar verilene kadar ek yükleme alanı veya formlar arası kural eklenmez.',
    },
    openQuestions: '',
    fields: { talent: ['belgeTipi'], cari: ['istisnaBelgesi', 'sirketBelgeTuru'] },
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
