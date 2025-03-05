import InputBox from 'components/InputBox';
import './style.css';
import React, { ChangeEvent, KeyboardEvent, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { CheckCertificationRequestDto, EmailCertificationRequestDto, idCheckRequestDto, SignUpRequestDto } from 'apis/request/auth';
import { checkCertificationRequest, emailCertificationRequest, idCheckRequest, signUpRequest, SNS_SIGN_IN_URL } from 'apis';
import {  ResponseCode } from 'types/enums';
import { ResponseBody } from 'types';
import { checkCertificationResponseDto, emailCertificationResponseDto, idCheckResponseDto, SignUpResponseDto } from 'apis/response/auth';

export default function SignUp() {
  
  const idRef = useRef<HTMLInputElement | null>(null);
  const passwordRef = useRef<HTMLInputElement | null>(null);
  const passwordCheckRef = useRef<HTMLInputElement | null>(null);
  const emailRef = useRef<HTMLInputElement | null>(null);
  const certificationNumberRef = useRef<HTMLInputElement | null>(null);

  const [id, setId] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [passwordCheck, setPasswordCheck] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [certificationNumber, setCertificationNumber] = useState<string>('');

  const [isIdError, setIdError] = useState<boolean>(false);
  const [isPasswordError, setPasswordError] = useState<boolean>(false);
  const [isPasswordCheckError, setPasswordCheckError] = useState<boolean>(false);
  const [isEmailError, setEmailError] = useState<boolean>(false);
  const [isCertificationNumberError, setCertificationNumberError] = useState<boolean>(false);

  const [idMessage, setIdMessage] = useState<string>('');
  const [passwordMessage, setPasswordMessage] = useState<string>('');
  const [passwordCheckMessage, setPasswordCheckMessage] = useState<string>('');
  const [emailMessage, setEmailMessage] = useState<string>('');
  const [certificationNumberMessage, setCertificationNumberMessage] = useState<string>('');

  const [isIdCheck, setIdCheck] = useState<boolean>(false);
  const [isCertificationCheck, setCertificationCheck] = useState<boolean>(false);

  const signUpButtonClass = id && password && passwordCheck && email && certificationNumber ?
   'primary-button-lg': 'disable-button-lg';

  const emailPattern = /^[a-zA-Z0-9]*@([-.]?[a-zA-Z0-9])*\.[a-zA-Z]{2,4}$/;
  const passwordPattern = /^(?=.*[a-zA-Z])(?=.*[0-9])[a-zA-Z0-9]{8,13}$/;

  const navigate = useNavigate();

  const idCheckResponse = (responseBody: ResponseBody<idCheckResponseDto>) => {
    if (!responseBody) return;
    const { code } = responseBody;
  
    if (code === ResponseCode.VALIDATION_FAIL) {
      alert('아이디를 입력하세요.');
      return;
    }
  
    if (code === ResponseCode.DUPLICATE_ID) {
      setIdError(true);
      setIdMessage('이미 사용중인 아이디 입니다.');
      setIdCheck(false);
      return; // 여기서 return을 유지
    }
  
    if (code === ResponseCode.DATABASE_ERROR) {
      alert('데이터베이스 오류입니다.');
      return;
    }
  
    // SUCCESS일 때에만 실행되도록 변경
    if (code === ResponseCode.SUCCESS) {
      setIdError(false);
      setIdMessage('사용 가능한 아이디 입니다.');
      setIdCheck(true);
    }
  };
  

  const emailCertificationResponse = (responseBody: ResponseBody<emailCertificationResponseDto>) => {
  if (!responseBody) return;
  const { code } = responseBody;

  if (code === ResponseCode.VALIDATION_FAIL) {
    alert('아이디와 이메일을 모두 입력하세요.');
    return;
  }
  if (code === ResponseCode.DUPLICATE_ID) {
    setIdError(true);
    setIdMessage('이미 사용중인 아이디 입니다.');
    setIdCheck(false);
    return;
  }
  if (code === ResponseCode.MAIL_FAIL) {
    alert('이메일 전송에 실패했습니다.');
    return;
  }
  if (code === ResponseCode.DATABASE_ERROR) {
    alert('데이터베이스 오류입니다.');
    return;
  }

  // 이메일 인증에 성공한 경우 메시지 설정
  if (code === ResponseCode.SUCCESS) {
    setEmailError(false);
    setEmailMessage('인증번호가 전송되었습니다.');
  }
};

const checkCertificationResponse = (responseBody: ResponseBody<checkCertificationResponseDto>) => {
  if (!responseBody) return;
  const { code } = responseBody;

  if (code === ResponseCode.VALIDATION_FAIL) {
    alert('아이디, 이메일, 인증번호를 모두 입력하세요.');
    return;
  }
  if (code === ResponseCode.CERTIFICATION_FAIL) {
    setCertificationNumberError(true);
    setCertificationNumberMessage('인증번호가 일치하지 않습니다');
    setCertificationCheck(false);
    return;
  }
  if (code === ResponseCode.DATABASE_ERROR) {
    alert('데이터베이스 오류입니다.');
    return;
  }

  // 인증번호 확인에 성공한 경우 메시지 설정
  if (code === ResponseCode.SUCCESS) {
    setCertificationNumberError(false);
    setCertificationNumberMessage('인증번호가 확인되었습니다.');
    setCertificationCheck(true);
  }
};

const signUpResponse = (responseBody: ResponseBody<SignUpResponseDto>) => {
  if (!responseBody) return;

  const { code } = responseBody;

  // 다양한 경우에 대한 오류 메시지 처리
  if (code === ResponseCode.VALIDATION_FAIL) {
      alert('모든 값을 입력하세요.');
      return;
  }
  
  if (code === ResponseCode.DUPLICATE_ID) {
      setIdError(true);
      setIdMessage('이미 사용중인 아이디 입니다.');
      setIdCheck(false);
      return;
  }
  
  if (code === ResponseCode.CERTIFICATION_FAIL) {
      setCertificationNumberError(true);
      setCertificationNumberMessage('인증번호가 일치하지 않습니다');
      setCertificationCheck(false);
      return;
  }
  
  if (code === ResponseCode.DATABASE_ERROR) {
      alert('데이터베이스 오류입니다.');
      return;
  }

  if (code === ResponseCode.SUCCESS) {
    console.log('회원가입 성공, 페이지 이동');
    navigate('/auth/sign-in');
  }

};


  const onIdChangeHandler =  (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setId(value);
    setIdMessage('');
    setIdCheck(false);
  };

  const onPasswordChangeHandler =  (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setPassword(value);
    setPasswordMessage('');
  };

  const onPasswordCheckChangeHandler =  (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setPasswordCheck(value);
    setPasswordCheckMessage('');
  };

  const onEmailChangeHandler =  (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setEmail(value);
    setEmailMessage('');
  };

  const onCertificationNumberChangeHandler =  (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setCertificationNumber(value);
    setCertificationNumberMessage('');
    setCertificationCheck(false);
  };

  const onIdButtonClickHandler = () => {
    if(!id) return;
    const requestBody: idCheckRequestDto = {id};

    idCheckRequest(requestBody).then(idCheckResponse);
  };

  const onEmailButtonClickHandler = () => {
    if(!id || !email) return;
    const checkedEmail = emailPattern.test(email);
    if(!checkedEmail) {
      setEmailError(true);
      setEmailMessage('이메일 형식이 아닙니다.');
      return;
    }

    const requestBody: EmailCertificationRequestDto = {id,email};
    emailCertificationRequest(requestBody).then(emailCertificationResponse);
  };

  const onCertificationNumberButtonClickHandler = () => {
    if(!id || !email || !certificationNumber) return;

    const requestBody: CheckCertificationRequestDto = {id, email, certificationNumber};
    checkCertificationRequest(requestBody).then(checkCertificationResponse);
  };

  const onSignUpButtonClickHandler = () => {
    if(!id || !password || !passwordCheck || !email || !certificationNumber) return;
    if(!isIdCheck) {
      alert('중복 확인은 필수입니다.');
      return;
    }
    const checkedPassword = passwordPattern.test(password);
    if(!checkedPassword) {
      setPasswordError(true);
      setPasswordCheckMessage('영문, 숫자를 혼용하여 8~13자 입력해주세요.');
      return;
    }
    if(password !== passwordCheck) {
      setPasswordCheckError(true);
      setPasswordCheckMessage('비밀번호가 일치하지 않습니다.');
      return
    }
    if(!isCertificationCheck) {
      alert('이메일 인증은 필수입니다.');
      return;
    }
    const requestBody: SignUpRequestDto = {id, password, email,certificationNumber};
    signUpRequest(requestBody).then(signUpResponse);

  };

  const onSignInButtonClickHandler = () => {
    navigate('/auth/sign-in');
  };

  const onSnsSignInButtonClickHandler = (type: 'kakao' | 'naver') => {
    window.location.href = SNS_SIGN_IN_URL(type);
  };

  const onIdKeyDownHandler = (event: KeyboardEvent<HTMLInputElement>) => {
    if(event.key !=='Enter') return;
    onIdButtonClickHandler();
  };

  const onPasswordKeyDownHandler = (event: KeyboardEvent<HTMLInputElement>) => {
    if(event.key !=='Enter') return;
    if(!passwordCheckRef.current) return;
    passwordCheckRef.current.focus();
  };

  const onPasswordCheckKeyDownHandler = (event: KeyboardEvent<HTMLInputElement>) => {
    if(event.key !=='Enter') return;
    if(!emailRef.current) return;
    emailRef.current.focus();
  };

  const onEmailKeyDownHandler = (event: KeyboardEvent<HTMLInputElement>) => {
    if(event.key !=='Enter') return;
    onEmailButtonClickHandler();
  };

  const onCertificationNumberKeyDownHandler = (event: KeyboardEvent<HTMLInputElement>) => {
    if(event.key !=='Enter') return;
    onCertificationNumberButtonClickHandler();
  };
  
  return (
    <div id='sign-in-wrapper'>
      <div className='sign-up-image'></div>
      <div className='sign-up-container'>
          <div className='sign-up-box'>
            <div className='sign-up-title'>{'제목'}</div>
            <div className='sign-up-content-box'>
                <div className='sign-up-content-sns-sign-in-box'></div>
                  <div className='sign-up-content-sns-sign-in-title'>{'sns 회원가입'}</div>
                  <div className='sign-up-content-sns-sign-in-button-box'>
                  <div className='kakao-sign-in-button' onClick={() => onSnsSignInButtonClickHandler('kakao')}></div>
                  <div className='naver-sign-in-button' onClick={() => onSnsSignInButtonClickHandler('naver')}></div>
                  </div>
                <div className='sign-up-content-divider'></div>
                <div className='sign-up-content-input-box'>
                  <InputBox ref={idRef} title='아이디' 
                    placeholder='아이디를 입력해주세요' 
                    type='text' 
                    value={id} 
                    onChange={onIdChangeHandler} 
                    isErrorMessage={isIdError} 
                    message={idMessage} 
                    buttonTitle='중복 확인' 
                    onButtonClick={onIdButtonClickHandler} 
                    onKeydown={onIdKeyDownHandler} 
                  />
                  <InputBox ref={passwordRef} title='비밀번호' placeholder='비밀번호를 입력해주세요' type='password' value={password} onChange={onPasswordChangeHandler} isErrorMessage={isPasswordError} message={passwordMessage} onKeydown={onPasswordKeyDownHandler} />
                  <InputBox ref={passwordCheckRef} title='비밀번호 확인' placeholder='비밀번호를 입력해주세요' type='password' value={passwordCheck} onChange={onPasswordCheckChangeHandler} isErrorMessage={isPasswordCheckError} message={passwordCheckMessage} onKeydown={onPasswordCheckKeyDownHandler} />
                  <InputBox ref={emailRef} title='이메일' placeholder='이메일 주소를 입력해주세요' type='text' value={email} onChange={onEmailChangeHandler} isErrorMessage={isEmailError} message={emailMessage} buttonTitle='이메일 인증' onButtonClick={onEmailButtonClickHandler} onKeydown={onEmailKeyDownHandler} />
                  <InputBox ref={certificationNumberRef} title='인증번호' placeholder='인증번호 4자리를 입력해주세요' type='text'value={certificationNumber} onChange={onCertificationNumberChangeHandler} isErrorMessage={isCertificationNumberError} message={certificationNumberMessage} buttonTitle='이메일 인증 확인' onButtonClick={onCertificationNumberButtonClickHandler}  onKeydown={onCertificationNumberKeyDownHandler}/>
                </div>
                <div className='sign-up-content-button-box'>
                  <div className={`${signUpButtonClass} full-width`} onClick={onSignUpButtonClickHandler}>{'회원가입'}</div>
                  <div className='text-link-lg full-width' onClick={onSignInButtonClickHandler}>{'로그인'}</div>
                </div>
            </div>
          </div>
      </div>
    </div>
  )
}
