import { redirect } from 'next/navigation';

export default function HomePage() {
  // Redirect to the nerd game which is our main feature
  redirect('/nerd');
}