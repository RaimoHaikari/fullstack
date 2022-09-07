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

/*
 * Kun tämä välitetään parametrinä, niin komponentin sisällä mahdollista viitata storen tilaan propsin kautta. 
 */
const mapStateToProps = (state) => {
    return {
        notification: state.notification
    }
}

/*
 * Funktion connect ensimmäisenä parametrina voidaan määritellä funktio mapStateToProps, 
 * joka liittää joitakin storen tilan perusteella määriteltyjä asioita connect-funktiolla 
 * muodostetun yhdistetyn komponentin propseiksi
 */
const ConnectedNotification = connect(mapStateToProps)(Notification)

export default ConnectedNotification