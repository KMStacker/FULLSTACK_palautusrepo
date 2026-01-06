interface Result {
  periodLength: number;
  trainingDays: number;
  success: boolean;
  rating: number;
  ratingDescription: string;
  target: number;
  average: number;
}

interface ExerciseValues {
  target: number;
  dailyExercises: number[];
}

const checkExerciseArguments = (args: string[]): ExerciseValues => {
  if (args.length < 4) throw new Error("Too few arguments");
  
  const target = Number(args[2]);
  if (isNaN(target)) {
    throw new Error("Target aint no number");
  }

  const dailyExercises = args.slice(3).map(arg => {
    if (!isNaN(Number(arg))) {
      return Number(arg);
    } else {
      throw new Error("There is some other shit than numbers");
    }
  });

  return {
    target,
    dailyExercises
  };
};

export const calculateExercises = (dailyExercises: number[], target: number): Result => {
  const periodLength = dailyExercises.length;
  const trainingDays = dailyExercises.filter(day => day > 0).length;
  const average = dailyExercises.reduce((a, b) => a + b, 0) / periodLength;
  const success = average >= target;

  let rating: number;
  let ratingDescription: string;

  if (average < target) {
    rating = 1;
    ratingDescription = "You can do way better...";
  } else if (average < target * 1.5) {
    rating = 2;
    ratingDescription = "Not too bad but could be mightier.";
  } else {
    rating = 3;
    ratingDescription = "Mission accomplished!";
  }

  return {
    periodLength,
    trainingDays,
    success,
    rating,
    ratingDescription,
    target,
    average
  };
};

if (require.main === module) {
  try {
    const { target, dailyExercises } = checkExerciseArguments(process.argv);
    console.log(calculateExercises(dailyExercises, target));
  } catch (e: unknown) {
    let errorMessage = "Sum serious shit happened.";
    if (e instanceof Error) {
      errorMessage = e.message;
    }
    console.log(errorMessage);
  }
}