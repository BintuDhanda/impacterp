import axios from "axios";

export const sendOTP = (getOtp, getMobile) => {
    console.log(getMobile,getOtp, "parametere")
    let user = 'impactcampus';
    let password = 'K9F2HDNY';
    let mobile = getMobile;
    let sid = 'IMPHSR';
    let apiURL=`http://www.getwaysms.com/vendorsms/pushsms.aspx?user=${user}&password=${password}&msisdn=${mobile}&sid=${sid}&msg=Dear Student, Your Registration OTP is ${getOtp} Mobile No. 9050546000 Impact Academy, Hisar&fl=0&gwid=2`
    console.log("api url ", apiURL)
    return axios.get(apiURL)
}




//http://www.getwaysms.com/vendorsms/pushsms.aspx?user=impactcampus&password=K9F2HDNY&msisdn=9416669174&sid=IMPHSR&msg=Dear Student, Your Registration OTP is 1234 Mobile No. 9050546000 Impact Academy, Hisar&fl=0&gwid=2
