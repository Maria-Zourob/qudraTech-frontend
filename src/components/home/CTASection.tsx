import {getTranslations} from 'next-intl/server';
import {Reveal} from '@/components/Reveal';
import Link from 'next/link';

interface CTASectionProps {
  locale: string;
}

const CONTAINER = 'mx-auto w-full max-w-6xl px-5 sm:px-8';

export async function CTASection({
  locale,
}: CTASectionProps) {
  const t = await getTranslations('HomePage.cta');
  const isArabic = locale === 'ar';

  return (
    <section className="relative overflow-hidden bg-[var(--color-accent)] text-[var(--color-navy)] py-24 md:py-32">
      
      {/* الأعمدة البيانية الخلفية بشكل هادئ وناعم جداً */}
      <div
        aria-hidden
        className={`pointer-events-none absolute bottom-0 flex items-end gap-2 sm:gap-3 opacity-20 ${
          isArabic ? 'start-0 ps-6 sm:ps-12' : 'end-0 pe-6 sm:pe-12'
        }`}
      >
        <span className="h-16 w-8 bg-[var(--color-navy)] sm:h-24 sm:w-12 rounded-t-sm" />
        <span className="h-28 w-8 bg-[var(--color-navy)] sm:h-44 sm:w-12 rounded-t-sm" />
        <span className="h-40 w-8 bg-[var(--color-navy)] sm:h-64 sm:w-12 rounded-t-sm" />
        <span className="h-56 w-8 bg-[var(--color-navy)] sm:h-80 sm:w-12 rounded-t-sm shadow-xl" />
      </div>

      <div className={`${CONTAINER} relative z-10`}>
        <Reveal>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* الجانب الأيمن: العنوان الفخم والوصف */}
            <div className={`lg:col-span-6 flex flex-col ${isArabic ? 'items-start text-right' : 'items-start text-left'}`}>
              <h2 className="font-heading text-4xl sm:text-5xl md:text-6xl font-extrabold leading-[1.15] text-[var(--color-navy)] text-balance">
                {t('title')}
              </h2>

              <p className="mt-6 text-lg sm:text-xl leading-relaxed text-[var(--color-navy)]/90 font-medium">
                {t('description')}
              </p>

              <div className="mt-8 text-xs font-mono text-[var(--color-navy)]/70 tracking-wider">
                {isArabic ? '— خطوة المستقبل لأي مبادرة جادة.' : '— The future steps for any serious initiative.'}
              </div>
            </div>

            {/* الجانب الأيسر: الفورم المتناسق تماماً مع تصميم نموذج الاتصال */}
            <div className="lg:col-span-6 bg-[#092b49] text-white p-6 sm:p-8 rounded-3xl shadow-2xl relative border border-white/10">
              
              {/* شريط علوي صغير داخل الفورم */}
              <div className="flex justify-between items-center mb-6 border-b border-white/10 pb-4">
                <span className="text-xs font-mono tracking-widest text-[var(--color-accent)] uppercase">
                  {isArabic ? 'تسجيل المبادرة' : 'Initiative Form'}
                </span>
                <span className="w-2 h-2 rounded-full bg-[var(--color-accent)] animate-pulse"></span>
              </div>

              <form className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono text-[#d8d3c8] mb-1.5 uppercase tracking-wider">
                      {isArabic ? 'الاسم · Name' : 'Name · الاسم'}
                    </label>
                    <input
                      type="text"
                      placeholder={isArabic ? 'اكتب اسمك...' : 'Enter your name...'}
                      className="w-full bg-[#0c3860] border border-white/15 rounded-xl px-4 py-3 text-sm text-white placeholder-white/30 focus:outline-none focus:border-[var(--color-accent)] transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-[#d8d3c8] mb-1.5 uppercase tracking-wider">
                      {isArabic ? 'البريد · Email' : 'Email · البريد'}
                    </label>
                    <input
                      type="email"
                      placeholder="name@example.com"
                      className="w-full bg-[#0c3860] border border-white/15 rounded-xl px-4 py-3 text-sm text-white placeholder-white/30 focus:outline-none focus:border-[var(--color-accent)] transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono text-[#d8d3c8] mb-1.5 uppercase tracking-wider">
                    {isArabic ? 'الموضوع · Subject' : 'Subject · الموضوع'}
                  </label>
                  <input
                    type="text"
                    placeholder={isArabic ? 'عنوان المبادرة أو المشروع...' : 'Initiative or project subject...'}
                    className="w-full bg-[#0c3860] border border-white/15 rounded-xl px-4 py-3 text-sm text-white placeholder-white/30 focus:outline-none focus:border-[var(--color-accent)] transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-[#d8d3c8] mb-1.5 uppercase tracking-wider">
                    {isArabic ? 'الرسالة · Message' : 'Message · الرسالة'}
                  </label>
                  <textarea
                    rows={3}
                    placeholder={isArabic ? 'تفاصيل إضافية عن المبادرة...' : 'Additional details about the initiative...'}
                    className="w-full bg-[#0c3860] border border-white/15 rounded-xl px-4 py-3 text-sm text-white placeholder-white/30 focus:outline-none focus:border-[var(--color-accent)] transition-all resize-none"
                  ></textarea>
                </div>

                <div className="pt-2">
                  <Link
                    href={`/${locale}/contact`}
                    className="w-full flex items-center justify-center bg-[var(--color-accent)] hover:bg-[#d58228] text-[var(--color-navy)] font-bold py-4 rounded-xl shadow-lg transition-all text-base"
                  >
                    {t('button')}
                  </Link>
                </div>
              </form>

            </div>

          </div>
        </Reveal>
      </div>
    </section>
  );
}