import { getTranslations } from 'next-intl/server';
import { Reveal } from '@/components/Reveal';

interface JourneySectionProps {
  locale?: string;
}

const CONTAINER = 'mx-auto w-full max-w-6xl px-5 sm:px-8';

export async function JourneySection({ locale = 'ar' }: JourneySectionProps) {
  const isArabic = locale === 'ar';

  return (
    <div className="bg-[var(--color-bg)] text-[var(--color-navy)] py-20 md:py-28 space-y-32">
      
      {/* ---------------- سكشن 1: ليست دورة برمجة ---------------- */}
      <section className="relative">
        <div className={CONTAINER}>
          <Reveal>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
              
              {/* الجانب الأيمن (في العربي): البطاقات الثلاث */}
              <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-3 border border-[var(--color-line)] rounded-2xl overflow-hidden bg-white/50 backdrop-blur-sm">
                
                {/* البطاقة 1 */}
                <div className="p-6 border-b sm:border-b-0 sm:border-s border-[var(--color-line)] flex flex-col justify-between">
                  <span className="text-xs font-mono text-[var(--color-accent)] uppercase tracking-wider mb-3">
                    {isArabic ? 'أدوات متاحَة' : 'Tools'}
                  </span>
                  <div>
                    <h3 className="font-heading font-bold text-base text-[var(--color-navy)] mb-2">
                      {isArabic ? 'أدوات متاحة' : 'Available Tools'}
                    </h3>
                    <p className="text-xs text-[var(--color-ink)] leading-relaxed">
                      {isArabic ? 'هاتف أو لابتوب واحد يكفي مجموعة كاملة.' : 'One phone or laptop is enough for a whole group.'}
                    </p>
                  </div>
                </div>

                {/* البطاقة 2 */}
                <div className="p-6 border-b sm:border-b-0 sm:border-s border-[var(--color-line)] flex flex-col justify-between">
                  <span className="text-xs font-mono text-[var(--color-accent)] uppercase tracking-wider mb-3">
                    {isArabic ? 'معلّمون محليّون' : 'Mentors'}
                  </span>
                  <div>
                    <h3 className="font-heading font-bold text-base text-[var(--color-navy)] mb-2">
                      {isArabic ? 'معلّمون محليّون' : 'Local Mentors'}
                    </h3>
                    <p className="text-xs text-[var(--color-ink)] leading-relaxed">
                      {isArabic ? 'شابّ من المخيم نفسه مدرّب على المنهج.' : 'A youth from the camp trained on the curriculum.'}
                    </p>
                  </div>
                </div>

                {/* البطاقة 3 */}
                <div className="p-6 flex flex-col justify-between">
                  <span className="text-xs font-mono text-[var(--color-accent)] uppercase tracking-wider mb-3">
                    {isArabic ? 'مخرج ملموس' : 'Output'}
                  </span>
                  <div>
                    <h3 className="font-heading font-bold text-base text-[var(--color-navy)] mb-2">
                      {isArabic ? 'مخرج ملموس' : 'Tangible Output'}
                    </h3>
                    <p className="text-xs text-[var(--color-ink)] leading-relaxed">
                      {isArabic ? 'كل طفل يُنهي المسار بمشروع صغير يعرضه.' : 'Every child finishes with a small project to showcase.'}
                    </p>
                  </div>
                </div>

              </div>

              {/* الجانب الأيسر (في العربي): العنوان والوصف التعريفي */}
              <div className={`lg:col-span-6 flex flex-col ${isArabic ? 'items-start text-right' : 'items-start text-left'}`}>
                <div className="text-xs font-mono text-[var(--color-accent)] tracking-widest uppercase mb-3">
                  01 — WHAT IT IS
                </div>

                <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-extrabold leading-[1.2] text-[var(--color-navy)] text-balance">
                  {isArabic ? 'ليست دورة برمجة.. هي طريقة تفكير.' : 'Not a coding course.. it is a way of thinking.'}
                </h2>

                <p className="mt-6 text-base sm:text-lg leading-relaxed text-[var(--color-ink)] font-normal">
                  {isArabic 
                    ? 'في مخيمات النزوح، الكهرباء متقطعة والإنترنت ضعيف والأجهزة قليلة. بنينا المنهج حول هذا الواقع لا ضده: جلسات قصيرة، محتوى يعمل دون اتصال، وأدوات تُشارك بين الأطفال. ما تُعلمه ليس أداة بعينها — بل كيف يُصغ السؤال، وكيف يُقرأ الجواب، وكيف يُحكم عليه.'
                    : 'In displacement camps, electricity flickers, internet is scarce, and devices are few. We built the curriculum around this reality, not against it...'}
                </p>
              </div>

            </div>
          </Reveal>
        </div>
      </section>

      {/* ---------------- سكشن 2: أربع مراحل، ستة أسابيع ---------------- */}
      <section className="relative">
        <div className={CONTAINER}>
          <Reveal>
            <div className={`flex flex-col mb-12 ${isArabic ? 'items-start text-right' : 'items-start text-left'}`}>
              <div className="text-xs font-mono text-[var(--color-accent)] tracking-widest uppercase mb-3">
                02 — LEARNING JOURNEY
              </div>
              <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-extrabold text-[var(--color-navy)]">
                {isArabic ? 'أربع مراحل، ستة أسابيع' : 'Four phases, six weeks'}
              </h2>
            </div>

            {/* شبكة المراحل الأربع */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 border-t border-b border-[var(--color-accent)]/60">
              
              {/* المرحلة 4: المشروع */}
              <div className="p-6 sm:p-8 border-b sm:border-b-0 sm:border-s border-[var(--color-line)] flex flex-col justify-between">
                <div>
                  <span className="text-xs font-mono text-[var(--color-accent)] font-bold uppercase tracking-wider block mb-4">
                    {isArabic ? 'WEEK 5-6' : 'WEEK 5-6'}
                  </span>
                  <h3 className="font-heading font-bold text-xl text-[var(--color-navy)] mb-3">
                    {isArabic ? 'المشروع' : 'The Project'}
                  </h3>
                  <p className="text-sm text-[var(--color-ink)] leading-relaxed">
                    {isArabic ? 'قصة، أو لعبة بسيطة، أو دليل مصوّر — يصنعه الطفل ويعرضه على المخيم.' : 'A story, a simple game, or an illustrated guide made by the child.'}
                  </p>
                </div>
              </div>

              {/* المرحلة 3: الحكم */}
              <div className="p-6 sm:p-8 border-b sm:border-b-0 sm:border-s border-[var(--color-line)] flex flex-col justify-between">
                <div>
                  <span className="text-xs font-mono text-[var(--color-accent)] font-bold uppercase tracking-wider block mb-4">
                    {isArabic ? 'WEEK 4' : 'WEEK 4'}
                  </span>
                  <h3 className="font-heading font-bold text-xl text-[var(--color-navy)] mb-3">
                    {isArabic ? 'الحُكم' : 'Judgment'}
                  </h3>
                  <p className="text-sm text-[var(--color-ink)] leading-relaxed">
                    {isArabic ? 'متى تُخطئ الآلة؟ تمارين على التحقّق من المعلومة قبل تصديقها.' : 'When does the machine err? Exercises on verifying information.'}
                  </p>
                </div>
              </div>

              {/* المرحلة 2: السؤال */}
              <div className="p-6 sm:p-8 border-b sm:border-b-0 sm:border-s border-[var(--color-line)] flex flex-col justify-between">
                <div>
                  <span className="text-xs font-mono text-[var(--color-accent)] font-bold uppercase tracking-wider block mb-4">
                    {isArabic ? 'WEEK 2-3' : 'WEEK 2-3'}
                  </span>
                  <h3 className="font-heading font-bold text-xl text-[var(--color-navy)] mb-3">
                    {isArabic ? 'السؤال' : 'The Question'}
                  </h3>
                  <p className="text-sm text-[var(--color-ink)] leading-relaxed">
                    {isArabic ? 'هندسة الأوامر: صياغة، تحديد، إعادة صياغة. الفرق بين سؤال غامض وسؤال دقيق.' : 'Prompt engineering: formulation, refinement, and clarity.'}
                  </p>
                </div>
              </div>

              {/* المرحلة 1: الفضول */}
              <div className="p-6 sm:p-8 flex flex-col justify-between">
                <div>
                  <span className="text-xs font-mono text-[var(--color-accent)] font-bold uppercase tracking-wider block mb-4">
                    {isArabic ? 'WEEK 1' : 'WEEK 1'}
                  </span>
                  <h3 className="font-heading font-bold text-xl text-[var(--color-navy)] mb-3">
                    {isArabic ? 'الفضول' : 'Curiosity'}
                  </h3>
                  <p className="text-sm text-[var(--color-ink)] leading-relaxed">
                    {isArabic ? 'كيف يفكّر الحاسوب؟ ألعاب منطق بلا شاشة قبل أول جهاز.' : 'How does a computer think? Screenless logic games before the first device.'}
                  </p>
                </div>
              </div>

            </div>
          </Reveal>
        </div>
      </section>

    </div>
  );
}