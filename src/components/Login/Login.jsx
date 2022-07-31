import React, { useState, useEffect, useReducer, useContext, useRef } from 'react';

import Card from '../UI/Card/Card';
import classes from './Login.module.css';
import Button from '../UI/Button/Button';
import AuthContext from '../context/auth-context';
import Input from '../UI/Input/Input';

const emailReducer = (state, action) => {
  switch (action.type) {
    case 'USER_EMAIL_CHANGE':
      return { value: action.value, isValid: action.value.includes('@') };
    case 'USER_EMAIL_BLUR':
      return { value: state.value, isValid: state.value.includes('@') };
    default:
      return { value: '', isValid: false };
  }
};

const passwordReducer = (state, action) => {
  switch (action.type) {
    case 'USER_PASSWORD_CHANGE':
      return {
        value: action.value,
        isValid: action.value.trim().length > 6,
      };
    case 'USER_PASSWORD_BLUR':
      return {
        value: state.value,
        isValid: state.value.trim().length > 6,
      };
    default:
      return { value: '', isValid: false };
  }
};

const Login = (props) => {
  // const [enteredEmail, setEnteredEmail] = useState('');
  // const [emailIsValid, setEmailIsValid] = useState();
  // const [enteredPassword, setEnteredPassword] = useState('');
  // const [passwordIsValid, setPasswordIsValid] = useState();
  const [formIsValid, setFormIsValid] = useState(false);
  const authContext = useContext(AuthContext);

  const [emailState, dispatchEmail] = useReducer(emailReducer, { value: '', isValid: null });
  const [passwordState, dispatchPassword] = useReducer(passwordReducer, {
    value: '',
    isValid: null,
  });

  const emailInputRef = useRef();
  const passwordInputRef = useRef();

  const { isValid: emailIsValid } = emailState;
  const { isValid: passwordIsValid } = passwordState;

  useEffect(() => {
    const timeoutHandler = setTimeout(() => {
      setFormIsValid(emailIsValid && passwordIsValid);
    }, 500);

    return () => {
      clearTimeout(timeoutHandler);
    };
  }, [emailIsValid, passwordIsValid]);

  const emailChangeHandler = (event) => {
    dispatchEmail({
      type: 'USER_EMAIL_CHANGE',
      value: event.target.value,
      isValid: event.target.value.includes('@'),
    });

    // setFormIsValid(event.target.value.includes('@') && passwordState.value.trim().length > 6);
  };

  const passwordChangeHandler = (event) => {
    dispatchPassword({
      type: 'USER_PASSWORD_CHANGE',
      value: event.target.value,
      isValid: passwordState.value.trim().length > 6,
    });

    // setFormIsValid(emailState.value.includes('@') && passwordState.value.trim().length > 6);
  };

  const validateEmailHandler = () => {
    dispatchEmail({
      type: 'USER_EMAIL_BLUR',
    });
  };

  const validatePasswordHandler = () => {
    dispatchPassword({
      type: 'USER_PASSWORD_BLUR',
    });
    // setPasswordIsValid(enteredPassword.trim().length > 6);
  };

  const submitHandler = (event) => {
    event.preventDefault();
    if (formIsValid) {
      authContext.onLogin(emailState.value, passwordState.value);
    } else if (!emailIsValid) {
      emailInputRef.current.focus();
    } else {
      passwordInputRef.current.focus();
    }
  };

  return (
    <Card className={classes.login}>
      <form onSubmit={submitHandler}>
        <Input
          ref={emailInputRef}
          id='email'
          label='E-Mail'
          type='email'
          isValid={emailIsValid}
          value={emailState.value}
          onChange={emailChangeHandler}
          onBlur={validateEmailHandler}
        />
        <Input
          ref={passwordInputRef}
          id='password'
          label='Password'
          type='password'
          isValid={passwordIsValid}
          value={passwordState.value}
          onChange={passwordChangeHandler}
          onBlur={validatePasswordHandler}
        />
        <div className={classes.actions}>
          <Button type='submit' className={classes.btn}>
            Login
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default Login;
