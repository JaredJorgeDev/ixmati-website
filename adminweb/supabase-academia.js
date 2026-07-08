(function () {
  var cfg = window.IxmatiSupabaseConfig || {};
  var enabled = Boolean(
    window.supabase &&
    cfg.url &&
    cfg.anonKey &&
    cfg.url !== "SUPABASE_URL" &&
    cfg.anonKey !== "SUPABASE_ANON_KEY"
  );
  var client = enabled ? window.supabase.createClient(cfg.url, cfg.anonKey) : null;
  var catalog = { lessonsBySlug: {}, activitiesByModule: {}, quizzesByModule: {} };
  var progressCache = null;
  var submissionsCache = [];
  var attemptsCache = [];

  function emailFor(username) {
    if (!username) return "";
    if (username.indexOf("@") !== -1) return username.toLowerCase();
    return username.toLowerCase() + "@" + (cfg.usernameEmailDomain || "ixmati.local");
  }

  function currentLocalUser() {
    return window.AdminWebAuth && window.AdminWebAuth.currentUser && window.AdminWebAuth.currentUser();
  }

  function profileRole(profile) {
    return profile && profile.role ? profile.role : null;
  }

  function loginSlug(username, email) {
    var value = String(username || email || "").toLowerCase();
    return value.split("@")[0];
  }

  function roleForLogin(username, email, profile) {
    if (loginSlug(username, email) === "leslie" || loginSlug(profile && profile.email, email) === "leslie" || profileRole(profile) === "leslie") return null;
    if (loginSlug(username, email) === "flor" || loginSlug(profile && profile.email, email) === "flor") return "flor";
    if (loginSlug(username, email) === "admin" || loginSlug(username, email) === "supersu" || loginSlug(profile && profile.email, email) === "admin" || loginSlug(profile && profile.email, email) === "supersu") return "superadmin";
    return profileRole(profile) || "student";
  }

  function authHome(role) {
    if (role === "superadmin" || role === "instructor") return "admin-su.html";
    if (role === "flor") return "produccion-flor.html";
    if (role === "student" || role === "instructor") return "academia.html";
    return "index.html";
  }

  function signIn(username, password) {
    if (!client) return Promise.resolve(null);
    if (loginSlug(username) === "leslie") return Promise.resolve(null);
    return client.auth.signInWithPassword({ email: emailFor(username), password: password }).then(function (result) {
      if (result.error || !result.data || !result.data.user) return null;
      return client.from("profiles").select("id,email,full_name,role").eq("id", result.data.user.id).maybeSingle().then(function (profileResult) {
        var profile = profileResult.data || {};
        var role = roleForLogin(username, result.data.user.email, profile);
        if (!role) return null;
        var normalizedUsername = username.indexOf("@") === -1 ? username.toLowerCase() : loginSlug(username, result.data.user.email);
        return {
          id: result.data.user.id,
          username: normalizedUsername,
          email: result.data.user.email,
          fullName: profile.full_name || username,
          role: role,
          home: authHome(role)
        };
      });
    }).catch(function () {
      return null;
    });
  }

  function signOut() {
    if (!client) return Promise.resolve();
    return client.auth.signOut().catch(function () {});
  }

  function lessonSlug(module, index) {
    return module.id + "-leccion-" + String(index + 1).padStart(2, "0");
  }

  function activitySlug(module) {
    return module.id + "-actividad-practica";
  }

  function quizSlug(module) {
    return module.id + "-evaluacion-final";
  }

  function moduleFromLessonSlug(slug) {
    return String(slug || "").replace(/-leccion-\d+$/, "");
  }

  function lessonIndexFromSlug(slug) {
    var match = String(slug || "").match(/-leccion-(\d+)$/);
    return match ? Math.max(0, Number(match[1]) - 1) : 0;
  }

  function loadCatalog(modules) {
    if (!client) return Promise.resolve(catalog);
    var moduleSlugs = modules.map(function (module) { return module.id; });
    var lessonSlugs = [];
    var activitySlugs = [];
    var quizSlugs = [];
    modules.forEach(function (module) {
      module.lessons.forEach(function (lesson, index) { lessonSlugs.push(lessonSlug(module, index)); });
      activitySlugs.push(activitySlug(module));
      quizSlugs.push(quizSlug(module));
    });
    return Promise.all([
      client.from("lessons").select("id,slug").in("slug", lessonSlugs),
      client.from("activities").select("id,slug,module_id,modules!inner(slug)").in("slug", activitySlugs),
      client.from("quizzes").select("id,slug,module_id,modules!inner(slug)").in("slug", quizSlugs)
    ]).then(function (results) {
      catalog = { lessonsBySlug: {}, activitiesByModule: {}, quizzesByModule: {} };
      (results[0].data || []).forEach(function (row) { catalog.lessonsBySlug[row.slug] = row.id; });
      (results[1].data || []).forEach(function (row) {
        var moduleSlug = row.modules && row.modules.slug;
        if (moduleSlugs.indexOf(moduleSlug) !== -1) catalog.activitiesByModule[moduleSlug] = row.id;
      });
      (results[2].data || []).forEach(function (row) {
        var moduleSlug = row.modules && row.modules.slug;
        if (moduleSlugs.indexOf(moduleSlug) !== -1) catalog.quizzesByModule[moduleSlug] = row.id;
      });
      return catalog;
    }).catch(function () {
      return catalog;
    });
  }

  function readRemoteProgress(modules) {
    if (!client) return Promise.resolve(null);
    return loadCatalog(modules).then(function () {
      return Promise.all([
        client.from("student_progress").select("status,completed_at,updated_at,lessons!inner(slug)").eq("status", "completed"),
        client.from("submissions").select("content,status,grade,feedback,submitted_at,reviewed_at,activities!inner(slug,modules!inner(slug))"),
        client.from("quiz_attempts").select("score,answers,passed,created_at,quizzes!inner(slug,modules!inner(slug))").order("created_at", { ascending: false })
      ]);
    }).then(function (results) {
      var progress = {};
      modules.forEach(function (module) {
        progress[module.id] = { lessons: {}, practiceDone: false, notes: "", exam: null, updatedAt: null };
      });
      (results[0].data || []).forEach(function (row) {
        var slug = row.lessons && row.lessons.slug;
        var moduleId = moduleFromLessonSlug(slug);
        if (!progress[moduleId]) return;
        progress[moduleId].lessons[lessonIndexFromSlug(slug)] = true;
        progress[moduleId].updatedAt = row.updated_at || row.completed_at || progress[moduleId].updatedAt;
      });
      submissionsCache = results[1].data || [];
      submissionsCache.forEach(function (row) {
        var moduleId = row.activities && row.activities.modules && row.activities.modules.slug;
        if (!progress[moduleId]) return;
        progress[moduleId].practiceDone = row.status === "aprobado" || row.status === "submitted" || row.status === "requiere_correccion";
        progress[moduleId].submission = row;
        progress[moduleId].updatedAt = row.reviewed_at || row.submitted_at || progress[moduleId].updatedAt;
      });
      attemptsCache = results[2].data || [];
      attemptsCache.forEach(function (row) {
        var moduleId = row.quizzes && row.quizzes.modules && row.quizzes.modules.slug;
        if (!progress[moduleId] || progress[moduleId].exam) return;
        progress[moduleId].exam = {
          correct: null,
          total: null,
          percentage: row.score,
          approved: row.passed,
          completedAt: row.created_at,
          answers: row.answers
        };
        progress[moduleId].updatedAt = row.created_at || progress[moduleId].updatedAt;
      });
      progressCache = progress;
      return progress;
    }).catch(function () {
      return null;
    });
  }

  function saveLesson(module, lessonIndex) {
    if (!client) return Promise.resolve(false);
    var lessonId = catalog.lessonsBySlug[module.id + "-leccion-" + String(lessonIndex + 1).padStart(2, "0")];
    if (!lessonId) return Promise.resolve(false);
    return client.from("student_progress").upsert({
      lesson_id: lessonId,
      status: "completed",
      completed_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }, { onConflict: "user_id,lesson_id" }).then(function (result) {
      return !result.error;
    }).catch(function () { return false; });
  }

  function submitActivity(module, content) {
    if (!client) return Promise.resolve(false);
    var activityId = catalog.activitiesByModule[module.id];
    if (!activityId) return Promise.resolve(false);
    return client.from("submissions").insert({
      activity_id: activityId,
      content: content,
      status: "submitted",
      submitted_at: new Date().toISOString()
    }).then(function (result) {
      return !result.error;
    }).catch(function () { return false; });
  }

  function saveQuizAttempt(module, exam, answers) {
    if (!client) return Promise.resolve(false);
    var quizId = catalog.quizzesByModule[module.id];
    if (!quizId) return Promise.resolve(false);
    return client.from("quiz_attempts").insert({
      quiz_id: quizId,
      score: exam.percentage,
      answers: answers,
      passed: exam.approved,
      created_at: exam.completedAt
    }).then(function (result) {
      return !result.error;
    }).catch(function () { return false; });
  }

  function migrateLocalProgress(modules, localProgress) {
    if (!client || !localProgress) return Promise.resolve(false);
    var jobs = [];
    modules.forEach(function (module) {
      var item = localProgress[module.id] || {};
      Object.keys(item.lessons || {}).forEach(function (index) {
        if (item.lessons[index]) jobs.push(saveLesson(module, Number(index)));
      });
      if (item.practiceDone) {
        jobs.push(submitActivity(module, { migrated: true, notes: item.practiceNotes || {}, source: "localStorage" }));
      }
      if (item.exam) {
        jobs.push(saveQuizAttempt(module, item.exam, item.exam.answers || {}));
      }
    });
    return Promise.all(jobs).then(function () { return true; }).catch(function () { return false; });
  }

  function listAdminData() {
    if (!client) return Promise.resolve(null);
    return Promise.all([
      client.from("profiles").select("id,email,full_name,role,created_at").in("role", ["student", "flor"]),
      client.from("student_progress").select("user_id,status,completed_at,lessons!inner(slug,modules!inner(slug))"),
      client.from("submissions").select("id,user_id,content,status,grade,feedback,submitted_at,reviewed_at,activities!inner(title,slug,modules!inner(slug,title)),profiles!inner(full_name,email)"),
      client.from("quiz_attempts").select("user_id,score,passed,created_at,quizzes!inner(slug,modules!inner(slug,title)),profiles!inner(full_name,email)")
    ]).then(function (results) {
      return {
        profiles: results[0].data || [],
        progress: results[1].data || [],
        submissions: results[2].data || [],
        attempts: results[3].data || []
      };
    }).catch(function () {
      return null;
    });
  }

  function reviewSubmission(id, patch) {
    if (!client) return Promise.resolve(false);
    return client.from("submissions").update({
      status: patch.status,
      grade: patch.grade === "" || patch.grade == null ? null : Number(patch.grade),
      feedback: patch.feedback || "",
      reviewed_at: new Date().toISOString()
    }).eq("id", id).then(function (result) {
      return !result.error;
    }).catch(function () { return false; });
  }

  window.IxmatiAcademySupabase = {
    enabled: enabled,
    client: client,
    signIn: signIn,
    signOut: signOut,
    readRemoteProgress: readRemoteProgress,
    saveLesson: saveLesson,
    submitActivity: submitActivity,
    saveQuizAttempt: saveQuizAttempt,
    migrateLocalProgress: migrateLocalProgress,
    listAdminData: listAdminData,
    reviewSubmission: reviewSubmission,
    lessonSlug: lessonSlug,
    activitySlug: activitySlug,
    quizSlug: quizSlug,
    currentLocalUser: currentLocalUser
  };
})();
