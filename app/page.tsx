import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

const RootPage = async () => {
  try {
    const userCookies = await cookies();
    const userToken = userCookies.get('auth-token');

    if (userToken) {
      return redirect('/dashboard');
    } else {
      return redirect('/home');
    }
  } catch (error) {
    console.error(error, 'Error checking user status');
    return redirect('/login');
  }

  return null;
};

export default RootPage;
