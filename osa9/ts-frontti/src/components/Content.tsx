import { CoursePart } from '../types';

import Part from './Part';

/*
 * 
 */
const Content = (props: {parts: CoursePart[]}): JSX.Element => {

    const {parts} = props;

    return (
        <div>
            {
                parts.map((part, index) => {

                    return (
                        <Part 
                            key={index}
                            part={part}
                        />
                    );
                })
            }
        </div>
    );
};

export default Content;