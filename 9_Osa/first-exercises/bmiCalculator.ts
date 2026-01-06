
interface BmiValues {
  value1: number
  value2: number
}

const checkBmiArguments = (args: string[]): BmiValues => {
  if (args.length < 4) throw new Error("Too few arguments");
  if (args.length > 4) throw new Error("Not quite enough arguments");

  if (!isNaN(Number(args[2])) && !isNaN(Number(args[3]))) {
    return {
      value1: Number(args[2]),
      value2: Number(args[3])
    };
  } else {
    throw new Error("Nada nums in there!");
  }
};

export const calculateBmi = (height: number, weight: number): string => {

  const bmi = weight / ((height / 100) ** 2);
    if (bmi < 18.5) {
      return "Underweight";
    } else if (bmi < 25) {
      return "Normal weight";
    } else if (bmi < 30) {
      return "Overweight";
    } else {
      return "Obese";
    }

};
if (require.main === module) {
  try {
    const { value1, value2 } = checkBmiArguments(process.argv);
    console.log(calculateBmi(value1, value2));
  } catch (e: unknown) {
    let errorMessage = "Sum serious shit happened.";
    if (e instanceof Error) {
      errorMessage = e.message;
    }
    console.log(errorMessage);
  }
}