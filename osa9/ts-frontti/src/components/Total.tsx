import { CoursePart } from '../types';

/*
const Content = (props: {parts: CoursePart[]}): JSX.Element => {

    const {parts} = props;
*/
const Total = (props: {parts: CoursePart[]}): JSX.Element => {

    const {parts} = props;

    const getTotalNumberOfExercises = () => {

        return parts.reduce((carry, part) => carry + part.exerciseCount, 0);
    }

    return (
        <p>
            {`Number of exercises: ${getTotalNumberOfExercises()}`}
        </p>
    );
};

export default Total;