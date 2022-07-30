import React, { useState, useEffect, useReducer } from 'react';

import Card from '../UI/Card/Card';
import classes from './Login.module.css';
import Button from '../UI/Button/Button';

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

  const [emailState, dispatchEmail] = useReducer(emailReducer, { value: '', isValid: null });
  const [passwordState, dispatchPassword] = useReducer(passwordReducer, {
    value: '',
    isValid: null,
  });

  useEffect(() => {
    const timeoutHandler = setTimeout(() => {
      console.log('Timeout');
      setFormIsValid(emailState.isValid && passwordState.isValid);
    }, 500);

    return () => {
      console.log('Cleanup');
      clearTimeout(timeoutHandler);
    };
  }, [emailState, passwordState]);

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
    props.onLogin(emailState.value, passwordState.value);
  };

  return (
    <Card className={classes.login}>
      <form onSubmit={submitHandler}>
        <div
          className={`${classes.control} ${emailState.isValid === false ? classes.invalid : ''}`}
        >
          <label htmlFor='email'>E-Mail</label>
          <input
            type='email'
            id='email'
            value={emailState.value}
            onChange={emailChangeHandler}
            onBlur={validateEmailHandler}
          />
        </div>
        <div
          className={`${classes.control} ${passwordState.isValid === false ? classes.invalid : ''}`}
        >
          <label htmlFor='password'>Password</label>
          <input
            type='password'
            id='password'
            value={passwordState.value}
            onChange={passwordChangeHandler}
            onBlur={validatePasswordHandler}
          />
        </div>
        <div className={classes.actions}>
          <Button type='submit' className={classes.btn} disabled={!formIsValid}>
            Login
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default Login;
