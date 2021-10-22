import IApplicant from '../../interfaces/applicant';

export const calcRating = (ratingsObj: IApplicant['ratings']): number => {
  const unsafeRatings = Object.values(ratingsObj) as (string|number)[];
  const ratings = unsafeRatings.map(r => typeof r === 'string'? parseInt(r) : r) as number[];
  const numOfRatings = ratings.length;
  const avgRating = Math.round(ratings.reduce((a: number, b: number) => a + b, 0) / numOfRatings * 100) / 100;
  return avgRating;
}

export const filterSex = (applicants: IApplicant[], male: boolean, female: boolean): IApplicant[] => {
  const filter: string[] = [];
  if (male) filter.push('Männlich');
  if (female) filter.push('Weiblich');
  return [...applicants].filter(a => a.gender ? filter.includes(a.gender) : true);
}

export const applySearch = (applicants: IApplicant[], search: string) => {
  return [...applicants].filter(applicant => {
      return applicant.name.toLowerCase().includes(search.toLowerCase());
  })
}

export const applySort = (applicants: IApplicant[], ranking: 'newest' | 'score') => {
  switch (ranking) {
      case "newest": {
        applicants.sort((a: IApplicant, b: IApplicant) => {
              return b.when - a.when;
          });
          return [...applicants];
      }
      case "score": {
        applicants.sort((a: IApplicant, b: IApplicant) => {
              const ratingA = calcRating(a.ratings);
              const ratingB = calcRating(b.ratings);
              return ratingB - ratingA;
          });
        return [...applicants];
      }
  }
}