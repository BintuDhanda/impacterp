import axios from 'axios';
import {Post as httpPost} from './httpService';
export const sendOTP = async (otp, mobile) => {
  const smsType = 'OTPSMS';
  const response = await httpPost('User/SendOTP', {number: mobile, msg: otp?.toString(), type: smsType})
  console.log(response)
  return response;
};

//http://www.getwaysms.com/vendorsms/pushsms.aspx?user=impactcampus&password=K9F2HDNY&msisdn=9416669174&sid=IMPHSR&msg=Dear Student, Your Registration OTP is 1234 Mobile No. 9050546000 Impact Academy, Hisar&fl=0&gwid=2
