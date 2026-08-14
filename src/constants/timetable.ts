import { LectureSlot } from '../types/attendance';

// Weekly timetable mapping: day of week (1 = Monday, ..., 5 = Friday)
export const TIMETABLE: Record<number, LectureSlot[]> = {
  1: [
    { s: 'Energy Ecology', c: 'EE', t: '11:00', e: '14:00' }
  ],
  2: [
    { s: 'Design Studio', c: 'DS', t: '07:30', e: '12:00' },
    { s: 'Vocabulary', c: 'VOC', t: '12:30', e: '15:30' }
  ],
  3: [
    { s: 'Minor', c: 'MIN', t: '07:30', e: '10:30' },
    { s: 'VAC', c: 'VAC', t: '12:00', e: '14:00' }
  ],
  4: [
    { s: 'Design Studio', c: 'DS', t: '12:00', e: '16:30' }
  ],
  5: [
    { s: 'Digital Fabrication', c: 'DF', t: '12:30', e: '15:30' }
  ]
};
