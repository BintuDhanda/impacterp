import axios from 'axios';
import {Post as httpPost} from './httpService';
export const sendOTP = (otp, mobile) => {
  let msg = `Dear Student, Your Registration OTP is ${otp} Mobile No. 9050546000 Impact Academy, Hisar`;
  // let user = 'impactcampus';
  // let password = 'K9F2HDNY';
  // let sid = 'IIMPCT';
  // let apiURL = `http://www.getwaysms.com/vendorsms/pushsms.aspx?user=${user}&password=${password}&msisdn=${mobile}&sid=${sid}&msg=${msg}&fl=0&gwid=2`;
  // return axios.get(apiURL);
  return httpPost('User/SendOTP', {number: mobile, msg});
};

//http://www.getwaysms.com/vendorsms/pushsms.aspx?user=impactcampus&password=K9F2HDNY&msisdn=9416669174&sid=IMPHSR&msg=Dear Student, Your Registration OTP is 1234 Mobile No. 9050546000 Impact Academy, Hisar&fl=0&gwid=2
