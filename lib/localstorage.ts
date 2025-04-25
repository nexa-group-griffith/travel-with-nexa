"use client"

import CryptoJS from "crypto-js"

const localStorageKeys = {
  token: "token",
  user: "user",
  toDestinations: "toDestinations",
}

interface AddToLocalStorageProps<T> {
  input?: T
  key: string
  encryptionKey?: string
}

export const encryptDataNoIv = (data: any, userSecretKey: string) => {
  try {
    const encryptedData = CryptoJS.AES.encrypt(JSON.stringify(data), userSecretKey).toString()
    return encryptedData
  } catch (error) {
    return null
  }
}

export const decryptDataNoIv = (encryptedData: any, userSecretKey: string) => {
  try {
    const decryptedData = CryptoJS.AES.decrypt(encryptedData, userSecretKey).toString(CryptoJS.enc.Utf8)
    return JSON.parse(decryptedData)
  } catch (error) {
    return null
  }
}

const userSecretKey = process.env.NEXT_PUBLIC_LOCALSTORAGE_ENCRYPT_KEY || ""

export const addToLocalStorage = <T>({
  input,
  key,
  encryptionKey = userSecretKey,
}: AddToLocalStorageProps<T>): void => {
  if (typeof window !== 'undefined') {
    const encryptedData = encryptDataNoIv(input, encryptionKey);
    if (encryptedData) {
      localStorage.setItem(key, encryptedData);
    }
  }
};

export const getFromLocalStorage = <T>({
  key,
  encryptionKey = userSecretKey,
}: AddToLocalStorageProps<T>): T | null => {
  if (typeof window !== 'undefined') {
    const encryptedData = localStorage.getItem(key);
    if (!encryptedData) return null;

    const decryptedData = decryptDataNoIv(encryptedData, encryptionKey);
    return decryptedData;
  }
  return null;
};

export const removeFromLocalStorage = (key: string): void => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(key);
  }
};

export const addUserDataToLocalStorage = (input: any) => {
  const userData = JSON.stringify(input);
  addToLocalStorage({ input: userData, key: localStorageKeys.user });
};

export const getUserDataFromLocalStorage = (): any => {
  const userData = getFromLocalStorage({ key: localStorageKeys.user });
  return typeof userData === 'string' ? JSON.parse(userData) : null;
};

export const removeUserDataFromLocalStorage = () => {
  removeFromLocalStorage(localStorageKeys.user);
};

export const addTopDestinationsToLocalStorage = (input: any) => {
  const userData = JSON.stringify(input);
  addToLocalStorage({ input: userData, key: localStorageKeys.toDestinations });
};

export const getTopDestinationsFromLocalStorage = (): any => {
  const userData = getFromLocalStorage({
    key: localStorageKeys.toDestinations,
  });
  return typeof userData === 'string' ? JSON.parse(userData) : null;
};

export const removeTopDestinationsFromLocalStorage = () => {
  removeFromLocalStorage(localStorageKeys.toDestinations);
};
