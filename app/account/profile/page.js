import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import ProfileForm from "@/components/account/ProfileForm";

export const metadata = { title: "Profile | Aiefashion" };

export default async function ProfilePage() {
  const cookieStore = await cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() { return cookieStore.getAll(); },
        setAll() {},
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();

  return (
    <div className="max-w-lg space-y-10">
      <h2 className="font-heading text-lg text-foreground">Profile</h2>
      <ProfileForm user={user} />
    </div>
  );
}
