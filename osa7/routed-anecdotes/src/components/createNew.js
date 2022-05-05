import {useNavigate} from 'react-router-dom';

import {useField} from '../hooks';

const CreateNew = (props) => {
    
    const content = useField('content','text');
    const author = useField('author','text');
    const info = useField('info', 'text');
    
    //const [content, setContent] = useState('');
    //const [author, setAuthor] = useState('');
    //const [info, setInfo] = useState('');

    const navigate = useNavigate();
  
  
    const handleSubmit = (e) => {

        e.preventDefault()

        props.addNew({
            content: content.value,
            author: author.value,
            info: info.value,
            votes: 0
        })

        navigate('/')
    }

    const handleReset = () => {

        content.reset();
        author.reset();
        info.reset();
        
    }

    /*
     * Teht 7.6
     *
     * How to omit specific properties from an object in JavaScript
     * https://stackoverflow.com/questions/43011742/how-to-omit-specific-properties-from-an-object-in-javascript/43011802
     */
    const inputFilter = ({name,type,value,onChange}) => ({name,type,value,onChange});


    return (
        <div>
        <h2>create a new anecdote</h2>
            <form onSubmit={handleSubmit}>

                <div>
                    content
                    <input {...inputFilter({...content})} />
                </div>
                <div>
                    author
                    <input {...inputFilter({...author})} />
                </div>
                <div>
                    url for more info
                    <input {...inputFilter({...info})} />
                </div>

                <button type="submit">create</button>

                <button
                    type='button'
                    onClick={() => handleReset()}
                >reset</button>

            </form>
        </div>
    );
};

export default CreateNew;