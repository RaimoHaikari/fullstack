// import express from 'express';
import { BMI } from "./customModules/BMI";

try {

    const bmi = new BMI();
    const { height, weight } = bmi.parseArguments(process.argv);
    
    console.log(bmi.calculateBmi(height, weight));

} catch (error: unknown) {
    
    let errorMessage = 'Something bad happened.';

    if (error instanceof Error) {
        errorMessage += ' Error: ' + error.message;
    }
        console.log(errorMessage);
}
