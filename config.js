/* إعدادات الاتصال — طابوني برو
   SUPABASE_URL و SUPABASE_ANON_KEY من: Supabase ← Project Settings ← API
   (مفتاح anon عام ومخصّص للمتصفح؛ الحماية الفعلية عن طريق قواعد RLS بملف supabase/setup.sql)
   لا تحط هون أبدًا مفتاح service_role. */
window.TABOONI_CONFIG = {
  version: 'v1.23',
  supabaseUrl: '',
  supabaseAnonKey: '',
  // اسم المستخدم للأدمن (ayman) يتحوّل لإيميل الدخول بـ Supabase بإضافة هالدومين.
  // إذا كتبت إيميل كامل بشاشة الدخول، بيستعمله زي ما هو.
  loginDomain: '@taboonipro.com'
};
