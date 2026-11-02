/* The build script replaces this token with a hash of this release. */
(() => {
  "use strict";
  const BUILD_ID = "64d1eaffc237363735ae8ea6";
  const APP_PATH = "/sudoku/";
  const loading = document.getElementById("loading-screen");
  const message = document.getElementById("loading-message");
  const retry = document.getElementById("reload-button");
  const notice = document.getElementById("offline-notice");
  const offlineMessage = document.getElementById("offline-message");
  const offlineRetry = document.getElementById("offline-retry");
  let firstFrame = false;
  let registration;
  let hideNoticeTimer;
  let noticeDismissed = false;
  let offlineReady = false;
  let preparing = false;
  const observedWorkers = new WeakSet();

  function showNotice(text, { transient = false, retryable = false, force = false } = {}) {
    if (noticeDismissed && !force) return;
    clearTimeout(hideNoticeTimer);
    offlineMessage.textContent = text;
    offlineRetry.hidden = !retryable;
    notice.hidden = false;
    if (transient) hideNoticeTimer = setTimeout(() => { notice.hidden = true; }, 6500);
  }

  function failed(error) {
    if (firstFrame) return;
    console.error("Sudoku could not start:", error);
    message.textContent = navigator.onLine
      ? "Не удалось открыть игру. Попробуйте загрузить её ещё раз."
      : "Для первой загрузки нужен интернет. Подключитесь к сети и попробуйте снова.";
    document.getElementById("loading-spinner").hidden = true;
    retry.hidden = false;
  }

  window.sudokuShell = {
    failed,
    get offlineReady() { return offlineReady; },
    get buildId() { return BUILD_ID; },
  };
  retry.addEventListener("click", () => location.reload());
  document.getElementById("offline-dismiss").addEventListener("click", () => {
    notice.hidden = true;
    noticeDismissed = true;
  });
  offlineRetry.addEventListener("click", () => {
    noticeDismissed = false;
    void prepareOffline();
  });

  window.addEventListener("flutter-first-frame", () => {
    firstFrame = true;
    loading.hidden = true;
  }, { once: true });
  window.addEventListener("error", (event) => {
    if (!firstFrame && (event.target instanceof HTMLScriptElement || event.error)) {
      failed(event.error || new Error("Script failed to load"));
    }
  }, true);
  setTimeout(() => {
    if (!firstFrame && retry.hidden) {
      message.textContent = "Загрузка занимает чуть больше времени. Проверьте подключение к интернету.";
      retry.hidden = false;
    }
  }, 30000);

  function statusOf(worker) {
    return new Promise((resolve) => {
      if (!worker) return resolve(null);
      const channel = new MessageChannel();
      const timer = setTimeout(() => { channel.port1.close(); resolve(null); }, 4000);
      channel.port1.onmessage = (event) => {
        clearTimeout(timer);
        channel.port1.close();
        resolve(event.data);
      };
      try {
        worker.postMessage({ type: "SUDOKU_STATUS" }, [channel.port2]);
      } catch (_) {
        clearTimeout(timer);
        channel.port1.close();
        resolve(null);
      }
    });
  }

  async function refreshStatus() {
    const status = await statusOf(registration?.active);
    offlineReady = status?.type === "SUDOKU_STATUS" && status.complete === true;
    if (offlineReady) {
      showNotice("Можно играть без интернета", { transient: true });
    }
    if (registration?.waiting) {
      showNotice("Обновление готово. Оно применится после закрытия всех окон игры.", { transient: true });
    }
  }

  function observeInstalling(worker) {
    if (!worker || observedWorkers.has(worker)) return;
    observedWorkers.add(worker);
    worker.addEventListener("statechange", () => {
      if (worker.state === "activated" || worker.state === "installed") void refreshStatus();
      if (worker.state === "redundant" && !registration?.waiting) {
        showNotice(offlineReady
          ? "Обновление пока не загрузилось. Текущая версия доступна без интернета."
          : "Игра открыта, но загрузка для игры без интернета не завершена.",
        { retryable: true, force: true });
      }
    });
  }

  async function prepareOffline() {
    if (preparing) return;
    if (!window.isSecureContext || !("serviceWorker" in navigator)) {
      showNotice("В этом браузере игра доступна с подключением к интернету.", { transient: true });
      return;
    }
    // Local Flutter development does not install an incomplete release worker.
    if (BUILD_ID.startsWith("__")) return;
    preparing = true;
    try {
      let wasRegistered = false;
      if (!registration) {
        const existing = await navigator.serviceWorker.getRegistration(APP_PATH);
        const exactScope = new URL(APP_PATH, location.origin).href;
        if (existing?.scope === exactScope) {
          registration = existing;
          wasRegistered = true;
        } else {
          registration = await navigator.serviceWorker.register(`${APP_PATH}sw.js`, {
            scope: APP_PATH,
            updateViaCache: "none",
          });
        }
        registration.addEventListener("updatefound", () => observeInstalling(registration.installing));
      } else {
        wasRegistered = true;
      }
      observeInstalling(registration.installing);
      // A fully cached cold start must not depend on fetching sw.js again.
      await refreshStatus();
      if (wasRegistered && navigator.onLine) await registration.update();
      if (!offlineReady && !registration.waiting) {
        if (navigator.onLine) {
          showNotice("Загружаем игру для работы без интернета…");
          if (registration.active && !registration.installing) {
            registration.active.postMessage({ type: "SUDOKU_REPAIR_CACHE" });
          }
        } else {
          showNotice("Для завершения загрузки игры нужен интернет.", { retryable: true });
        }
      }
    } catch (error) {
      console.warn("Sudoku offline preparation:", error);
      showNotice(offlineReady
        ? "Проверим обновления, когда появится интернет."
        : "Игра без интернета пока недоступна. Проверьте соединение и повторите.",
      { retryable: !offlineReady, transient: offlineReady });
    } finally {
      preparing = false;
    }
  }

  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.addEventListener("message", (event) => {
      // Ignore messages from the portfolio or any other worker on this origin.
      const scriptURL = event.source?.scriptURL;
      if (!scriptURL || new URL(scriptURL).pathname !== `${APP_PATH}sw.js`) return;
      const data = event.data;
      if (data?.type === "SUDOKU_CACHE_PROGRESS" && !offlineReady) {
        const percent = Math.floor(data.completed / data.total * 100);
        showNotice(`Готовим игру без интернета… ${percent}%`);
      }
      if (data?.type === "SUDOKU_CACHE_READY") void refreshStatus();
      if (data?.type === "SUDOKU_CACHE_FAILED") {
        showNotice("Не удалось завершить загрузку для игры без интернета.", { retryable: true, force: true });
      }
    });
    navigator.serviceWorker.addEventListener("controllerchange", () => {
      // Never reload an active puzzle when a worker changes.
      void refreshStatus();
    });
    window.addEventListener("online", () => { void prepareOffline(); });
  }
  void prepareOffline();
})();
