export interface Initiative {
  slug: string;
  titleAr: string;
  titleEn: string;
  descriptionAr: string;
  descriptionEn: string;
  status: 'Active' | 'Planned' | 'Completed' | 'OnHold';
  location: string;
}

export const mockInitiatives: Initiative[] = [
  {
    slug: 'gaza-qudratech',
    titleAr: 'قدرات غزة الرقمية',
    titleEn: 'Gaza QudraTech',
    descriptionAr: 'تعليم الأطفال هندسة أوامر الذكاء الاصطناعي في خيام النزوح بغزة.',
    descriptionEn: 'Teaching children AI prompt engineering in displacement camps in Gaza.',
    status: 'Active',
    location: 'Gaza'
  }
];