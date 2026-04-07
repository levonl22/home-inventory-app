## [04-06-26] APK & Expo mixup, token expiration, duplicate items in database

**What happened:** 
Opened WHFAH APK to test features. Noticed I was signed out, and I got this error:
ERROR [AuthApiError: Invalid Refresh Token: Refresh Token Not Found]
Restarted app, signed in, signed out to test features. The merge prompt was not showing up to merge local to cloud.
Tested on Expo through npm start -- worked just fine. Noticed items completely changed and had duplicate items -- which it shouldn't.

**How to reproduce:**
No known reproduction at the moment. Suspect refresh token needs to expire again to resurface.

**Diagnosis:**
APK and Expo maintain separate AsyncStorage instances, giving them different local item lists while sharing the same Supabase household. The wipe-and-reinsert sync strategy caused one client to overwrite the other's data. Exact sequence of events unclear — happened too fast while debugging an unrelated issue.

**Fix:**
Replaced wipe-and-reinsert with upsert using `household_id` + `name` as the conflict key. Added a unique constraint on those columns in Supabase to support the upsert logic.

**Lesson:**
During development, avoid running APK and Expo simultaneously against the same Supabase household. Treat them as two separate users — they will conflict. Be extra careful with separate storages and syncing. Make sure both have the same logic.