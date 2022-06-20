export interface BmiValues {
    height: number;
    weight: number;
}

export class BMI {

    parseQueryParameters(w: string, h: string): BmiValues {

        if (!isNaN(Number(w)) && !isNaN(Number(h))) {
            return {
              height: Number(h),
              weight: Number(w)
            };
        } else {
            throw new Error('Provided values were not numbers!');
        }

    }

    parseArguments (args: Array<string>): BmiValues {
        if (args.length < 4) throw new Error('Not enough arguments');
        if (args.length > 4) throw new Error('Too many arguments');

        if (!isNaN(Number(args[2])) && !isNaN(Number(args[3]))) {
            return {
              height: Number(args[2]),
              weight: Number(args[3])
            };
        } else {
            throw new Error('Provided values were not numbers!');
        }
    }


    /*
    * Body mass index
    * https://en.wikipedia.org/wiki/Body_mass_index
    */
    calculateBmi (height: number, weight: number): string {

        const bmi = weight / Math.pow(height/100, 2);
        //console.log(bmi)
        let val;

        if(bmi < 16) val = 'Underweight (Severe thinness)';
        else if(bmi >= 16 && bmi < 17) val = 'Underweight (Moderate thinness)';
        else if(bmi >= 17 && bmi < 18.5) val = 'Underweight (Mild thinness)';
        else if(bmi >= 18.5 && bmi < 25) val = 'Normal range';
        else if(bmi >= 25 && bmi < 30) val = 'Overweight (Pre-obese)';
        else if(bmi >= 30 && bmi < 35) val = 'Obese (Class I)';
        else if(bmi >= 35 && bmi < 40) val = 'Obese (Class II)';
        else val = 'Obese (Class III)';

        return val;

    }

}