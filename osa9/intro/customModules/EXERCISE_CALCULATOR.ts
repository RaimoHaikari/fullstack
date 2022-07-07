export interface StudyValues {
    targetValue: number,
    dailyExerciseHours: Array<number>
}

export interface Summary {
    periodLength: number,
    trainingDays: number,
    success: boolean,
    rating: number,
    ratingDescription: string,
    target: number,
    average: number
}

export class ExerciseCalculator {

    foo(){
        console.log("Foo");
    }


    calculateExercises(target: number, dEH: Array<number>): Summary {

        const tolerance = 0.5;
    
        const _periodLength = dEH.length;
        const _trainingDays = dEH.filter(d => d > 0).length;
    
        /* 
         * Lasketaan opiskeluun käytettyjen tuntien yhteismäärä ja sen avulla keskimääräinen
         * päivittäiseen opiskeluun käytetty määrä
         */
        const hoursTotal = _periodLength === 0 ? 0 : dEH.reduce((accumulator, currentValue) => accumulator + currentValue);
    
        const _average = hoursTotal !== 0 ? hoursTotal/_periodLength : 0;
    
        const _success = _average < target ? false : true;
    
    
        let _ratingDescription = "You must study harder";
        let _rating = 1;
    
        if(((_average + tolerance) > target)){
            _ratingDescription = "Not too bad but could be better";
            _rating = 2;
        }
    
        if((_average > target)) {
            _ratingDescription = "Very very very well done";
            _rating = 3;
        }
    
        return {
            periodLength: _periodLength,
            trainingDays: _trainingDays,
            success: _success,
            rating: _rating,
            ratingDescription: _ratingDescription,
            target: target,
            average: _average
        };
    
    }

    isValidArray(arr: Array<number>): boolean{

        if(Array.isArray(arr) === false)
            return false;

        const x = arr.filter(a =>typeof a === 'number');
        
        return x.length === arr.length;
    }

    parseECArguments(args: Array<string>): StudyValues {

        let target = 0;
        const hours = new Array<number>();
    
        if (args.length < 4) throw new Error('Not enough arguments');
    
        for(let i = 2; i < args.length; i++){
    
            if(isNaN(Number(args[i]))){
                throw new Error('All the provided values need to be numbers!');
            }
    
            if(i == 2) {
                target = Number(args[i]);
            } else {
                hours.push( Number(args[i]));
            }
    
        }
    
        return {
            targetValue: target,
            dailyExerciseHours: hours
        };
    
    }

}