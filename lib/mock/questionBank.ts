export const QUESTION_BANK = {
  General: {
    Beginner: 20,
    Intermediate: 35,
    Advanced: 50,
  },

  Google: {
    Beginner: 30,
    Intermediate: 45,
    Advanced: 60,
  },

  Amazon: {
    Beginner: 25,
    Intermediate: 40,
    Advanced: 55,
  },

  Microsoft: {
    Beginner: 25,
    Intermediate: 40,
    Advanced: 55,
  },

  Meta: {
    Beginner: 30,
    Intermediate: 45,
    Advanced: 60,
  },
}

export function getQuestionLimit(
  company: string | null | undefined,
  difficulty: string
) {
  const companyBank =
    QUESTION_BANK[company as keyof typeof QUESTION_BANK] ??
    QUESTION_BANK.General

  return (
    companyBank[difficulty as keyof typeof companyBank] ??
    QUESTION_BANK.General.Beginner
  )
}

