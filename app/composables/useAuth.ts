export const useAuth = () => {
  const supabase = useSupabaseClient()
  const user = useSupabaseUser()

  async function signIn(email: string, password: string) {
    return supabase.auth.signInWithPassword({ email, password })
  }

  async function signOut() {
    await supabase.auth.signOut()
    await navigateTo('/admin/login')
  }

  return { user, signIn, signOut }
}
