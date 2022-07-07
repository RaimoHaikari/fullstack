import { ExerciseCalculator } from './customModules/EXERCISE_CALCULATOR';


try {

    const ec = new ExerciseCalculator();

    const { targetValue, dailyExerciseHours } = ec.parseECArguments(process.argv);
    
    const returnVal = ec.calculateExercises(
        targetValue,
        dailyExerciseHours,
    );

    console.log(returnVal);

} catch (error: unknown) {
    
    let errorMessage = 'Something bad happened.';

    if (error instanceof Error) {
        errorMessage += ' Error: ' + error.message;
    }
        console.log(errorMessage);
}
