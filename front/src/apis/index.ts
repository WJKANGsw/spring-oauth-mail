import axios, { AxiosResponse } from "axios";
import { CheckCertificationRequestDto, EmailCertificationRequestDto, idCheckRequestDto, SignInRequestDto, SignUpRequestDto } from "./request/auth";
import { checkCertificationResponseDto, emailCertificationResponseDto, idCheckResponseDto, SignInResponseDto, SignUpResponseDto } from "./response/auth";
import { ResponseDto } from "./response";
import { error } from "console";

const responseHandler = <T>(response: AxiosResponse<any,any>) => {
  const responseBody: T = response.data;
      return responseBody;
};

const errorHandler = (error:any) => {
  if(!error.response || !error.response.data) return null;
      const responseBody: ResponseDto = error.response.data;
      return responseBody;
}

const DOMAIN = 'http://localhost:4040';

const API_DOMAIN = `${DOMAIN}/api/v1`;

const ID_CHECK_URL = () => `${API_DOMAIN}/auth/id-check`;
const EMAIL_CERTIFICATION_URL = () => `${API_DOMAIN}/auth/email-certification`;
const CHECK_CERTIFICATION_URL = () => `${API_DOMAIN}/auth/check-certification`;
const SIGN_UP_URL = () => `${API_DOMAIN}/auth/sign-up`;
const SIGN_IN_URL = () => `${API_DOMAIN}/auth/sign-in`;
export const SNS_SIGN_IN_URL = (type: 'kakao' | 'naver') => `${API_DOMAIN}/auth/oauth2/${type}`;

export const signInRequest = async (requestBody: SignInRequestDto) => {
  const result = await axios.post(SIGN_IN_URL(), requestBody)
    .then(responseHandler<SignInResponseDto>)
    .catch(errorHandler);
  return result;
}

export const signUpRequest = async (requestBody: SignUpRequestDto) => {
  const result = await axios.post(SIGN_UP_URL(), requestBody)
    .then(responseHandler<SignUpResponseDto>)
    .catch(errorHandler);
  return result;
}

export const idCheckRequest = async (requestBody:idCheckRequestDto) => {
  const result = await axios.post(ID_CHECK_URL(), requestBody)
    .then(responseHandler<idCheckResponseDto>)
    .catch(errorHandler);
  return result;
};

export const emailCertificationRequest = async (requestBody: EmailCertificationRequestDto) => {
  const result = await axios.post(EMAIL_CERTIFICATION_URL(), requestBody)
    .then(responseHandler<emailCertificationResponseDto>)
    .catch(errorHandler);
  return result;
}

export const checkCertificationRequest = async (requestBody: CheckCertificationRequestDto) => {
  const result = await axios.post(CHECK_CERTIFICATION_URL(), requestBody)
    .then(responseHandler<checkCertificationResponseDto>)
    .catch(errorHandler);
  return result;
}

