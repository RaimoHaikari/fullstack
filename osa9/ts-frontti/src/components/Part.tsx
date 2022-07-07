import { CoursePart } from '../types';

/*
 * const Content = (props: {parts: CoursePartsProps[]}): JSX.Element => {
 */
const Part = (props: {part: CoursePart}): JSX.Element  => {

    const {part} = props;

    const assertNever = (value: never): never => {
        throw new Error(
            `Unhandled discriminated union member: ${JSON.stringify(value)}`
        );
    };
    

    /*
switch (part.name) {
            case "Fundamentals":
            case "Advanced":

                console.log(description)
                return <>
                    <li>1</li>
                    <li>2</li>
                </>
            case "Using props to pass data":
                return <>
                    <li>1</li>
                    <li>2</li>
                </>
            case "Deeper type usage":
                return <>
                    <li>1</li>
                    <li>2</li>
                </>

        }
    */
    const fooBar = () => {
        switch (part.type) {
            case "normal":
                return <li>{`description: ${part.description}`}</li>
            case "groupProject":
                return <li>{`groupProjectCount: ${part.groupProjectCount}`}</li>
            case "submission":
                return <>
                    <li>{`description: ${part.description}`}</li>
                    <li>{`exerciseSubmissionLink: ${part.exerciseSubmissionLink}`}</li>
                </>
            case "special":
                return <>
                    <li>{`description: ${part.description}`}</li>
                    <li>{`requirements: ${part.requirements.join(', ')}`}</li>
                </>
            default:
                return assertNever(part);

        }
    }
    
    return (
        <div>
            <p>{`${part.name}`}</p>
            <ul>
                <li>{`exerciseCount: ${part.exerciseCount}`}</li>
            {
                fooBar()
            }
            </ul>
        </div>
    );
};

export default Part;