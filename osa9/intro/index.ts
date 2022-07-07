import express from 'express';
const app = express();

import { BMI } from './customModules/BMI';
// import { ExerciseCalculator } from './customModules/EXERCISE_CALCULATOR';
import { ExerciseCalculator } from './customModules/EXERCISE_CALCULATOR';

app.use(express.json());

app.get('/hello', (_req, res) => {
    res.send('Hello Full Stack!');
});

/*
 *
 */
app.get('/bmi', (req, res) => {

  try {

    const bmi = new BMI();
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const { height, weight } = req.query;

    const heightTest = !height || isNaN(Number(height));
    const weightTest = !height || isNaN(Number(weight));

    if ( heightTest || weightTest) {

      return res.status(400).json({ 
        error: "malformatted parameters"
      });

    }

    const msg = bmi.calculateBmi(Number(height), Number(weight));

    return res.json({
      weight: weight,
      height: height,
      bmi: msg
    });


  } catch (error: unknown) {

    return res.status(400).json({ 
      error: "Something unexpected happened"
    });

  }
});


/*
 * Saapuvan aineiston oletetaan olevan muotoa:
 *
 * {
 *   "daily_exercises": [1, 0, 2, 0, 3, 0, 2.5],
 *   "target": 2.5
 * }
 */
app.post('/exercises', (req, res) => {

  try { 

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const { daily_exercises, target } = req.body;

    /* Löytyykö tarvittavat parametrit */
    if(!target || !daily_exercises){

      return res.status(400).json({ 
        error: "parameters missing"
      });

    }

    const ec = new ExerciseCalculator();

    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    const exercisesTest = ec.isValidArray(daily_exercises);
    const badTargetValue = isNaN(Number(target));  



    /*
     * Tarvittavat parametrit löytyi, mutta tieto oli väärän muotoista
     */
    if (badTargetValue || (exercisesTest === false)) {

      return res.status(400).json({ 
        error: "malformatted parameters"
      });

    }

    
    const returnVal = ec.calculateExercises(
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      target,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      daily_exercises
    );

    return res.json(returnVal);

  } catch (error: unknown) {

    return res.status(400).json({ 
      error: "Something unexpected happened"
    });

  }

});

const PORT = 3003;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});