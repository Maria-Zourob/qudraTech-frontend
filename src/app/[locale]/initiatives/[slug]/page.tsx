import {getTranslations} from 'next-intl/server';
import Link from 'next/link';

interface Impact {
  initiatives: number;
  beneficiaries: number;
  volunteers: number;
  activities: number;
}

interface InitiativeSummary {
  slug: string;
  titleAr: string;
  titleEn: string;
  descriptionAr: string;
  descriptionEn: string;
  status: string;
  location: string;
}

async function getImpact(): Promise<Impact | null> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/public/impact`, {cache: 'no-store'});
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

async function getInitiatives(): Promise<InitiativeSummary[]> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/public/initiatives`, {cache: 'no-store'});
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

export default async function HomePage({
  params
}: {
  params: Promise<{locale: string}>;
}) {
  const {locale} = await params;
  const t = await getTranslations('HomePage');
  const impact = await getImpact();
  const initiatives = await getInitiatives();
  const isArabic = locale === 'ar';

  const stats = impact
    ? [
        {value: impact.initiatives, label: isArabic ? 'مبادرة' : 'Initiatives'},
        {value: impact.beneficiaries, label: isArabic ? 'مستفيد' : 'Beneficiaries'},
        {value: impact.volunteers, label: isArabic ? 'متطوع' : 'Volunteers'},
        {value: impact.activities, label: isArabic ? 'نشاط' : 'Activities'}
      ]
    : [];

  const lifecycle = isArabic
    ? [
        {code: '01', title: 'التوثيق', text: 'كل مبادرة تحصل على رقم رسمي وملف توثيق كامل منذ لحظة التسجيل.'},
        {code: '02', title: 'التنفيذ', text: 'الأنشطة والمؤشرات تُسجَّل أولًا بأول، لا بأثر رجعي بعد الانتهاء.'},
        {code: '03', title: 'القياس', text: 'كل مؤشر أداء له مصدر بيانات ودليل — لا رقم بدون إثبات.'},
        {code: '04', title: 'الأثر', text: 'النتائج تُنشر بشفافية على المنصة العامة، لأي زائر أو شريك أو داعم.'}
      ]
    : [
        {code: '01', title: 'Documentation', text: 'Every initiative gets an official ID and a full profile from day one.'},
        {code: '02', title: 'Execution', text: 'Activities and KPIs are logged as they happen, not reconstructed afterward.'},
        {code: '03', title: 'Measurement', text: 'Every indicator has a data source and evidence — no number without proof.'},
        {code: '04', title: 'Impact', text: 'Results are published transparently for any visitor, partner, or donor.'}
      ];

  const values = isArabic
    ? [
        {title: 'الشفافية', text: 'كل رقم منشور مرتبط بمصدر بيانات ودليل — لا نشر بلا إثبات.'},
        {title: 'قيادة مجتمعية', text: 'المبادرات تُقاد من المجتمع نفسه، لا تُفرض عليه من الخارج.'},
        {title: 'أثر قابل للقياس', text: 'كل مبادرة لها مؤشرات أداء واضحة، لا نشاط بلا نتيجة موثَّقة.'}
      ]
    : [
        {title: 'Transparency', text: 'Every published number is tied to a data source and evidence — nothing without proof.'},
        {title: 'Community-led', text: 'Initiatives are led by the community itself, not imposed from outside.'},
        {title: 'Measurable Impact', text: 'Every initiative has clear KPIs — no activity without a documented result.'}
      ];

  return (
    <main>
      {/* Hero */}
      <section className="border-b overflow-hidden" style={{borderColor: 'var(--color-line)'}}>
        <div className="max-w-5xl mx-auto px-8 py-20 md:py-28 grid md:grid-cols-5 gap-12 items-center">
          <div className="md:col-span-3">
            <p className="initiative-code text-sm mb-6" style={{color: 'var(--color-accent)'}}>
              {isArabic ? 'FS — منصة إدارة وتوثيق المبادرات المجتمعية' : 'FS — Community Initiative Platform'}
            </p>
            <h1 className="font-heading text-5xl md:text-6xl font-bold mb-6 leading-tight" style={{color: 'var(--color-navy)'}}>
              {t('title')}
            </h1>
            <p className="text-lg md:text-xl max-w-xl mb-10" style={{color: 'var(--color-ink)', opacity: 0.85}}>
              {t('subtitle')}
            </p>
            <div className="flex gap-4">
              <Link href={`/${locale}/initiatives`} className="px-7 py-3.5 font-medium text-white transition-opacity hover:opacity-90" style={{background: 'var(--color-navy)'}}>
                {t('exploreInitiatives')}
              </Link>
              <Link href={`/${locale}/about`} className="px-7 py-3.5 font-medium border transition-colors" style={{borderColor: 'var(--color-navy)', color: 'var(--color-navy)'}}>
                {t('aboutUs')}
              </Link>
            </div>
          </div>

          <div className="hidden md:flex md:col-span-2 justify-center">
            <svg width="220" height="260" viewBox="0 0 220 260" aria-hidden="true">
              <rect x="20" y="30" width="160" height="200" fill="white" stroke="var(--color-line)" strokeWidth="1.5" />
              <rect x="10" y="18" width="160" height="200" fill="white" stroke="var(--color-line)" strokeWidth="1.5" />
              <rect x="0" y="6" width="160" height="200" fill="white" stroke="var(--color-navy)" strokeWidth="1.5" />
              <rect x="16" y="24" width="90" height="6" fill="var(--color-accent)" />
              <rect x="16" y="42" width="128" height="3" fill="var(--color-line)" />
              <rect x="16" y="54" width="128" height="3" fill="var(--color-line)" />
              <rect x="16" y="66" width="80" height="3" fill="var(--color-line)" />
              <rect x="16" y="90" width="40" height="20" fill="var(--color-growth)" opacity="0.15" />
              <rect x="60" y="90" width="40" height="20" fill="var(--color-accent)" opacity="0.15" />
              <rect x="16" y="118" width="128" height="3" fill="var(--color-line)" />
              <rect x="16" y="130" width="100" height="3" fill="var(--color-line)" />
              <text x="16" y="180" fontFamily="ui-monospace, monospace" fontSize="11" fill="var(--color-navy)" opacity="0.5">
                FS-2026-001
              </text>
            </svg>
          </div>
        </div>
      </section>

      {/* Impact */}
      {stats.length > 0 && (
        <section className="max-w-5xl mx-auto px-8 py-16 border-b" style={{borderColor: 'var(--color-line)'}}>
          <div className="grid grid-cols-2 md:grid-cols-4">
            {stats.map((stat, i) => (
              <div key={stat.label} className={`py-6 px-6 ${i > 0 ? 'md:border-r' : ''}`} style={i > 0 ? {borderColor: 'var(--color-line)'} : undefined}>
                <p className="font-heading text-4xl font-bold mb-1" style={{color: 'var(--color-navy)'}}>
                  {stat.value}<span style={{color: 'var(--color-accent)'}}>+</span>
                </p>
                <p className="text-sm" style={{color: 'var(--color-ink)', opacity: 0.7}}>{stat.label}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* About */}
      <section className="max-w-5xl mx-auto px-8 py-20 grid md:grid-cols-2 gap-12">
        <div>
          <p className="initiative-code text-xs mb-3 tracking-wider" style={{color: 'var(--color-accent)'}}>
            {isArabic ? 'عن المنصة' : 'ABOUT'}
          </p>
          <h2 className="font-heading text-3xl font-bold mb-4" style={{color: 'var(--color-navy)'}}>
            {isArabic ? 'ليست موقعًا لمبادرة واحدة' : 'Not built for one initiative'}
          </h2>
        </div>
        <div className="flex items-center">
          <p className="text-base leading-relaxed" style={{color: 'var(--color-ink)', opacity: 0.85}}>
            {isArabic
              ? 'خطوات المستقبل منصة رقمية تجمع مبادرات مجتمعية متعددة، وتوثّق دورة حياة كل واحدة منها — من الفكرة إلى الأثر — بمعيار موحّد وشفاف. كل مبادرة تحصل على رقم توثيق رسمي، ومؤشرات أداء قابلة للقياس، وسجل تدقيق كامل.'
              : 'Future Steps is a digital platform bringing together multiple community initiatives, documenting each one\'s full lifecycle — from idea to impact — under one transparent standard. Every initiative gets an official documentation ID, measurable KPIs, and a full audit trail.'}
          </p>
        </div>
      </section>

      {/* Lifecycle */}
      <section className="border-t border-b" style={{borderColor: 'var(--color-line)', background: 'var(--color-navy)'}}>
        <div className="max-w-5xl mx-auto px-8 py-20">
          <h2 className="font-heading text-3xl font-bold mb-12 text-white">
            {isArabic ? 'كيف توثَّق المبادرة على المنصة' : 'How an initiative is documented'}
          </h2>
          <div className="grid md:grid-cols-4 gap-8">
            {lifecycle.map((step) => (
              <div key={step.code}>
                <p className="initiative-code text-sm mb-3" style={{color: 'var(--color-accent)'}}>{step.code}</p>
                <h3 className="font-heading text-lg font-bold mb-2 text-white">{step.title}</h3>
                <p className="text-sm leading-relaxed" style={{color: '#B9C5D0'}}>{step.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Initiatives */}
      {initiatives.length > 0 && (
        <section style={{background: '#FBFAF6'}}>
          <div className="max-w-5xl mx-auto px-8 py-20">
            <div className="flex items-baseline justify-between mb-10">
              <h2 className="font-heading text-3xl font-bold" style={{color: 'var(--color-navy)'}}>
                {isArabic ? 'مبادراتنا' : 'Our Initiatives'}
              </h2>
              <Link href={`/${locale}/initiatives`} className="text-sm font-medium" style={{color: 'var(--color-accent)'}}>
                {isArabic ? 'عرض الكل ←' : '→ View all'}
              </Link>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              {initiatives.map((initiative) => (
                <Link
                  key={initiative.slug}
                  href={`/${locale}/initiatives/${initiative.slug}`}
                  className="block p-7 bg-white border transition-shadow hover:shadow-md"
                  style={{borderColor: 'var(--color-line)'}}
                >
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-heading text-xl font-bold" style={{color: 'var(--color-navy)'}}>
                      {isArabic ? initiative.titleAr : initiative.titleEn}
                    </h3>
                    <span className="initiative-code text-xs px-2 py-1" style={{background: 'var(--color-growth)', color: 'white', opacity: 0.9}}>
                      {initiative.status}
                    </span>
                  </div>
                  <p className="text-sm mb-3" style={{color: 'var(--color-ink)', opacity: 0.7}}>📍 {initiative.location}</p>
                  <p className="text-sm leading-relaxed" style={{color: 'var(--color-ink)', opacity: 0.8}}>
                    {isArabic ? initiative.descriptionAr : initiative.descriptionEn}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Values */}
      <section className="max-w-5xl mx-auto px-8 py-20">
        <p className="initiative-code text-xs mb-3 tracking-wider text-center" style={{color: 'var(--color-accent)'}}>
          {isArabic ? 'قيمنا' : 'OUR VALUES'}
        </p>
        <h2 className="font-heading text-3xl font-bold mb-14 text-center" style={{color: 'var(--color-navy)'}}>
          {isArabic ? 'ما يوجّه عملنا' : 'What guides our work'}
        </h2>
        <div className="grid md:grid-cols-3 gap-10">
          {values.map((value) => (
            <div key={value.title} className="text-center md:text-start">
              <div className="w-10 h-10 mb-4 mx-auto md:mx-0" style={{background: 'var(--color-growth)'}} />
              <h3 className="font-heading text-lg font-bold mb-2" style={{color: 'var(--color-navy)'}}>
                {value.title}
              </h3>
              <p className="text-sm leading-relaxed" style={{color: 'var(--color-ink)', opacity: 0.8}}>
                {value.text}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Partners */}
      <section className="border-t" style={{borderColor: 'var(--color-line)', background: '#FBFAF6'}}>
        <div className="max-w-5xl mx-auto px-8 py-16 text-center">
          <p className="initiative-code text-xs mb-4 tracking-wider" style={{color: 'var(--color-accent)'}}>
            {isArabic ? 'شركاء ومجتمعات محلية' : 'PARTNERS & LOCAL COMMUNITIES'}
          </p>
          <p className="text-base max-w-xl mx-auto" style={{color: 'var(--color-ink)', opacity: 0.75}}>
            {isArabic
              ? 'المنصة بمراحلها الأولى، ونبني شراكاتها تدريجيًا مع لجان ومراكز مجتمعية محلية. كل شريك سيُعرض هنا بشفافية فور توثيق تعاونه.'
              : 'The platform is in its early stage, gradually building partnerships with local community committees and centers. Every partner will appear here transparently once their collaboration is documented.'}
          </p>
        </div>
      </section>

      {/* Join CTA */}
      <section className="max-w-5xl mx-auto px-8 py-24 text-center">
        <h2 className="font-heading text-3xl md:text-4xl font-bold mb-5" style={{color: 'var(--color-navy)'}}>
          {isArabic ? 'عندك مبادرة تستاهل توثَّق؟' : 'Have an initiative worth documenting?'}
        </h2>
        <p className="text-base mb-8 max-w-xl mx-auto" style={{color: 'var(--color-ink)', opacity: 0.75}}>
          {isArabic
            ? 'خطوات المستقبل مفتوحة لأي مبادرة مجتمعية جادة — من التسجيل إلى الأثر الموثَّق.'
            : 'Future Steps is open to any serious community initiative — from registration to documented impact.'}
        </p>
        <Link href={`/${locale}/contact`} className="inline-block px-8 py-3.5 font-medium text-white" style={{background: 'var(--color-accent)'}}>
          {isArabic ? 'تواصل معنا' : 'Get in Touch'}
        </Link>
      </section>
    </main>
  );
}