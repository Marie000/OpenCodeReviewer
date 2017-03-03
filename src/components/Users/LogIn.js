import React, { PropTypes as T } from 'react'
import AuthService from '../../utils/AuthService';
import {FlatButton} from 'material-ui';
//import styles from './styles.module.css'

export class Login extends React.Component {
  static propTypes = {
    location: T.object,
    auth: T.instanceOf(AuthService)
  }

  render() {
    const { auth } = this.props
    return (
      <div className="root profile-section">
          <FlatButton className="button" onClick={auth.login.bind(this)}>Login</FlatButton>
      </div>
    )
  }
}

export default Login;