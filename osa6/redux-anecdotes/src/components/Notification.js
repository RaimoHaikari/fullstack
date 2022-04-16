import { useSelector } from 'react-redux';

const Notification = () => {

  const style = {
    border: 'solid',
    padding: 10,
    borderWidth: 1
  }

  const {message} = useSelector(state => state.notification);  


  return (
    <>
    {
      message === null
      ? null
      : 
      <div style={style}>
        {message}
      </div>
    }
    </>

  )
}

export default Notification