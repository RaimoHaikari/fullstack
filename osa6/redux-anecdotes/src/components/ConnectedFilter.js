import { connect } from 'react-redux';
import {setFilter} from '../reducers/filterReducer';

/*
 * 6.20 anekdootit ja connect, step2
 * - Tee sama Filter ja AnecdoteForm komponenteille.
 */
const Filter = (props) => {

    const handleChange = (event) => {
        // input-kentän arvo muuttujassa event.target.value
        //dispatch({ type: 'filter/setFilter', payload: event.target.value });
        props.setFilter(event.target.value)
    }

    const style = {
        marginBottom: 10,
        paddingBottom: 10,
        borderBottom: '1px solid navy'
    }

    return (
        <div style={style}>
        filter <input onChange={handleChange} />
        </div>
    )
}

const mapDispatchToProps = {
    setFilter
}

const ConnectedFilter = connect(
    null,
    mapDispatchToProps
)(Filter)

export default ConnectedFilter;