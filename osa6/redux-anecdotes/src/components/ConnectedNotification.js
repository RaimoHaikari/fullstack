import { connect } from 'react-redux';

/*
 * 6.19 anekdootit ja connect, step1
 * - Redux storea käytetään tällä hetkellä useSelector ja useDispatch hookien avulla. 
 *   Tämä on varmasti paras tapa tehdä asiat, mutta harjoitellaan kuitenkin hieman connectin käyttöä.
 * 
 * - Muokkaa Notification komponenttia niin, että se käyttää connect funktiota hookien sijaan.
 */
const Notification = (props) => {

  const style = {
    border: 'solid',
    padding: 10,
    borderWidth: 1
  }

  const {message} = props.notification;  


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

const mapStateToProps = (state) => {
    return {
        notification: state.notification
    }
}

const ConnectedNotification = connect(mapStateToProps)(Notification)

export default ConnectedNotification