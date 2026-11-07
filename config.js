/* إعدادات الاتصال — طابوني برو
   مفتاح anon عام ومخصّص للمتصفح؛ الحماية الفعلية عن طريق قواعد RLS بملف supabase/setup.sql
   لا تحط هون أبدًا مفتاح service_role. */
window.TABOONI_CONFIG = {
  version: 'v1.26',
  supabaseUrl: 'https://lbrbvkdrfmgimryievzq.supabase.co',
  supabaseAnonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxicmJ2a2RyZm1naW1yeWlldnpxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTI3OTczNjYsImV4cCI6MjEwODM3MzM2Nn0.EpVguft2AOJ1wiE-7g4R27p3ekn8YafedwgrhkTYuhA',
  // اسم المستخدم (ayman) بيتحوّل لإيميل الدخول بإضافة هالدومين.
  // لحد ما نضبطه: بشاشة الدخول اكتب الإيميل الكامل.
  loginDomain: '@taboonipro.com'
};
