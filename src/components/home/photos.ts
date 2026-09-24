/**
 * Homepage photography registry.
 *
 * Every image area on the homepage is an intentional, art-directed slot.
 * While a slot's `src` is `null` it renders as a toned placeholder that shows
 * its shot brief (from `HomePage.photos.<id>.brief` in the message files).
 *
 * To add real photography:
 *   1. Put the file in `public/images/home/` (e.g. `hero-impact.jpg`).
 *   2. Set `src` below to `/images/home/hero-impact.jpg`.
 *   3. Update `HomePage.photos.<id>.alt` in `messages/ar.json` and `messages/en.json`
 *      so the alt text describes the real photo.
 *
 * `focus` is the CSS object-position used when the photo is cropped, so the
 * subject stays in frame at every breakpoint (e.g. '50% 30%').
 */

export type HomePhotoId =
  | 'heroDocumentation'
  | 'heroExecution'
  | 'heroMeasurement'
  | 'heroImpact'
  | 'manifestoHands'
  | 'manifestoTrainer'
  | 'phase1'
  | 'phase2'
  | 'phase3'
  | 'phase4'
  | 'learningClass'
  | 'impactGroup'
  | 'impactTrainers'
  | 'field1'
  | 'field2'
  | 'field3'
  | 'field4'
  | 'initiativeFeatured'
  | 'faqParents'
  | 'ctaVolunteers';

export interface HomePhoto {
  src: string | null;
  focus?: string;
}

export const homePhotos: Record<HomePhotoId, HomePhoto> = {
  heroDocumentation: {src: null},
  heroExecution: {src: null},
  heroMeasurement: {src: null},
  heroImpact: {
  src: '/images/home/hero.jpg',
  focus: '50% 30%',
},
  manifestoHands: {
  src: '/images/home/keyboard.jpg',
  focus: '50% 50%',
},
  manifestoTrainer: {
  src: '/images/home/female-trainer.jpg',
  focus: '50% 25%',
},
 phase1: {
  src: '/images/home/phase1.jpg',
  focus: '50% 50%',
},

phase2: {
  src: '/images/home/phase2.jpg',
  focus: '50% 50%',
},

phase3: {
  src: '/images/home/phase3.jpg',
  focus: '50% 50%',
},

phase4: {
  src: '/images/home/phase4.jpg',
  focus: '50% 35%',
},
  learningClass: {
  src: '/images/home/learning-class.jpg',
  focus: '50% 50%',
},
  impactGroup: {
  src: '/images/home/impact-group.jpg',
  focus: '50% 50%',
},
  impactTrainers: {
  src: '/images/home/impact-review.jpg',
  focus: '50% 40%',
},
  field1: {
  src: '/images/home/field1.jpg',
  focus: '50% 50%',
},

field2: {
  src: '/images/home/field2.jpg',
  focus: '50% 40%',
},

field3: {
  src: '/images/home/field3.jpg',
  focus: '50% 30%',
},

field4: {
  src: '/images/home/field4.jpg',
  focus: '50% 50%',
},
  initiativeFeatured: {
  src: '/images/home/initiative-featured.jpg',
  focus: '50% 40%',
},
  faqParents: {
  src: '/images/home/faq-parents.jpg',
  focus: '50% 30%',
},
  ctaVolunteers: {
  src: '/images/home/cta-volunteers.jpg',
  focus: '50% 40%',
},
};
