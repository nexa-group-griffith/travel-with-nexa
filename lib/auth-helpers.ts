import { cookies } from 'next/headers';
import { auth, db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import type { UserData } from '@/types/auth';

export async function getCurrentUser(): Promise<UserData | null> {
  try {
    const decodedToken = auth.currentUser;
    if (!decodedToken) {
      return null;
    }
    console.log('Decoded token:', decodedToken);

    const uid = decodedToken.uid;

    const userDoc = await getDoc(doc(db, 'users', uid));

    if (!userDoc.exists()) {
      return null;
    }

    const userData = userDoc.data() as UserData;
    return {
      ...userData,
      uid,
    };
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
}
