import {BASE_URL} from './constant'
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const getTokenFromStorage = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      return token;
    } catch (error) {
      console.error('Error retrieving token:', error);
      return null;
    }
  };

const headers = {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer '+getTokenFromStorage(),
  };

export const Post = async (EndPoint,data) =>{
  console.log(BASE_URL+EndPoint,data)
      return await axios.post(BASE_URL+EndPoint,JSON.stringify(data), {headers});
};
export const Put = async (EndPoint,data) =>{
    return await axios.put(BASE_URL+EndPoint,JSON.stringify(data), {headers});
};
export const Delete = async (EndPoint) =>{
    return await axios.delete(BASE_URL+EndPoint, {headers});
};
export const Get = async ( EndPoint) =>{
    return await axios.get(BASE_URL+EndPoint, {headers}); 
};
export const GetById = async (EndPoint) =>{
  return await axios.get(BASE_URL+EndPoint, {headers});
};