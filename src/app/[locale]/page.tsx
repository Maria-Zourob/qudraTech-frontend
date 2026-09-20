import {HeroSection} from '@/components/home/HeroSection';
import {AboutSection} from '@/components/home/AboutSection';
import {LifecycleSection} from '@/components/home/LifecycleSection';
import {InitiativesSection} from '@/components/home/InitiativesSection';
import {ValuesSection} from '@/components/home/ValuesSection';
import {CTASection} from '@/components/home/CTASection';
import ChildLearning from '@/components/home/ChildLearning';

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

interface LifecycleStep {
  code: string;
  title: string;
  text: string;
}

interface Value {
  title: string;
  text: string;
  icon: 'transparency' | 'community' | 'impact';
}

async function getImpact(): Promise<Impact | null> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/public/impact`,
      {cache: 'no-store'},
    );

    if (!res.ok) return null;

    return res.json();
  } catch {
    return null;
  }
}

async function getInitiatives(): Promise<InitiativeSummary[]> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/public/initiatives`,
      {cache: 'no-store'},
    );

    if (!res.ok) return [];

    return res.json();
  } catch {
    return [];
  }
}

export default async function HomePage({
  params,
}: {
  params: Promise<{locale: string}>;
}) {
  const {locale} = await params;

  const impact = await getImpact();
  const initiatives = await getInitiatives();

  // =========================
  // HERO
  // =========================

  const stats = impact
    ? [
        {
          value: impact.initiatives,
          label: locale === 'ar' ? 'مبادرة' : 'Initiatives',
        },
        {
          value: impact.beneficiaries,
          label: locale === 'ar' ? 'مستفيد' : 'Beneficiaries',
        },
        {
          value: impact.volunteers,
          label: locale === 'ar' ? 'متطوع' : 'Volunteers',
        },
        {
          value: impact.activities,
          label: locale === 'ar' ? 'نشاط' : 'Activities',
        },
      ]
    : [];

  // =========================
  // LIFECYCLE
  // =========================

  const lifecycle: LifecycleStep[] =
    locale === 'ar'
      ? [
          {
            code: '01',
            title: 'التوثيق',
            text: 'كل مبادرة تحصل على رقم رسمي وملف توثيق كامل منذ لحظة التسجيل.',
          },
          {
            code: '02',
            title: 'التنفيذ',
            text: 'الأنشطة والمؤشرات تُسجَّل أولًا بأول، لا بأثر رجعي بعد الانتهاء.',
          },
          {
            code: '03',
            title: 'القياس',
            text: 'كل مؤشر أداء له مصدر بيانات ودليل — لا رقم بدون إثبات.',
          },
          {
            code: '04',
            title: 'الأثر',
            text: 'النتائج تُنشر بشفافية على المنصة العامة، لأي زائر أو شريك أو داعم.',
          },
        ]
      : [
          {
            code: '01',
            title: 'Documentation',
            text: 'Every initiative gets an official ID and a full profile from day one.',
          },
          {
            code: '02',
            title: 'Execution',
            text: 'Activities and KPIs are logged as they happen, not reconstructed afterward.',
          },
          {
            code: '03',
            title: 'Measurement',
            text: 'Every indicator has a data source and evidence — no number without proof.',
          },
          {
            code: '04',
            title: 'Impact',
            text: 'Results are published transparently for any visitor, partner, or donor.',
          },
        ];

  // =========================
  // INITIATIVES
  // =========================

  const featured =
    initiatives.find(
      (initiative) => initiative.slug === 'gaza-qudratech',
    ) ?? initiatives[0];

  const featuredIsQudra =
    featured?.slug === 'gaza-qudratech';

  const restInitiatives = initiatives.filter(
    (initiative) => initiative.slug !== featured?.slug,
  );

  // =========================
  // VALUES
  // =========================

  const values: Value[] =
    locale === 'ar'
      ? [
          {
            title: 'الشفافية',
            text: 'كل رقم منشور مرتبط بمصدر بيانات ودليل — لا نشر بلا إثبات.',
            icon: 'transparency',
          },
          {
            title: 'قيادة مجتمعية',
            text: 'المبادرات تُقاد من المجتمع نفسه، لا تُفرض عليه من الخارج.',
            icon: 'community',
          },
          {
            title: 'أثر قابل للقياس',
            text: 'كل مبادرة لها مؤشرات أداء واضحة، لا نشاط بلا نتيجة موثَّقة.',
            icon: 'impact',
          },
        ]
      : [
          {
            title: 'Transparency',
            text: 'Every published number is tied to a data source and evidence — nothing without proof.',
            icon: 'transparency',
          },
          {
            title: 'Community-led',
            text: 'Initiatives are led by the community itself, not imposed from outside.',
            icon: 'community',
          },
          {
            title: 'Measurable Impact',
            text: 'Every initiative has clear KPIs — no activity without a documented result.',
            icon: 'impact',
          },
        ];

  return (
    <main className="overflow-x-clip">
      {/* 1. HERO */}
      <HeroSection
        locale={locale}
        stats={stats}
      />

      {/* 2. CHILD LEARNING */}
      <ChildLearning locale={locale} />

      {/* 3. ABOUT */}
      <AboutSection />

      {/* 4. LIFECYCLE */}
      <LifecycleSection
        lifecycle={lifecycle}
      />

      {/* 5. INITIATIVES */}
      {featured && (
        <InitiativesSection
          locale={locale}
          featured={featured}
          featuredIsQudra={featuredIsQudra}
          restInitiatives={restInitiatives}
        />
      )}

      {/* 6. VALUES */}
      <ValuesSection
        values={values}
      />

      {/* 7. CTA */}
      <CTASection
        locale={locale}
      />
    </main>
  );
}