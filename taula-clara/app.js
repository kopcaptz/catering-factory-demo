// Фабрика сайтов кейтеринга: окно WhatsApp (демо), фильтр меню, форма заказа. Без библиотек, без cookies.
(function () {
  var dlg = document.getElementById("wa-dialog");
  var textBox = document.getElementById("wa-text");

  function openWa(message, number) {
    if (number) {
      window.open("https://wa.me/" + number + "?text=" + encodeURIComponent(message), "_blank", "noopener");
      return;
    }
    if (!dlg || !textBox) return;
    textBox.textContent = message;
    if (typeof dlg.showModal === "function") dlg.showModal(); else dlg.setAttribute("open", "");
  }

  document.addEventListener("click", function (e) {
    var a = e.target.closest("[data-wa]");
    if (a && a.tagName === "A") {
      e.preventDefault();
      openWa(a.getAttribute("data-wa"));
    }
  });

  var copy = document.getElementById("wa-copy");
  if (copy) {
    copy.addEventListener("click", function () {
      var t = textBox ? textBox.textContent : "";
      var original = copy.getAttribute("data-original") || copy.innerHTML;
      copy.setAttribute("data-original", original);
      var done = function () { copy.textContent = copy.getAttribute("data-done"); setTimeout(function () { copy.innerHTML = original; }, 1500); };
      if (navigator.clipboard) navigator.clipboard.writeText(t).then(done, function () {});
    });
  }

  var today = new Date();
  var iso = today.getFullYear() + "-" + String(today.getMonth() + 1).padStart(2, "0") + "-" + String(today.getDate()).padStart(2, "0");
  document.querySelectorAll("form.order-form input[type=date]").forEach(function (d) { d.min = iso; });

  document.querySelectorAll("form.order-form").forEach(function (f) {
    f.addEventListener("submit", function (e) {
      e.preventDefault();
      var labels = JSON.parse(f.getAttribute("data-labels"));
      var lines = [f.getAttribute("data-base")];
      var add = function (name, key) {
        var el = f.elements[name];
        if (el && el.value.trim()) lines.push(labels[key].split("{v}").join(el.value.trim()));
      };
      var d = f.elements.date;
      if (d && d.value) {
        var parts = d.value.split("-");
        var shown = new Date(+parts[0], +parts[1] - 1, +parts[2]).toLocaleDateString(document.documentElement.lang, { weekday: "long", day: "numeric", month: "long", year: "numeric" });
        lines.push(labels.wa_date.split("{v}").join(shown));
      }
      add("guests", "wa_guests"); add("town", "wa_town"); add("notes", "wa_notes");
      openWa(lines.join("\n"), f.getAttribute("data-wa"));
    });
  });

  var buttons = document.querySelectorAll(".filters button");
  buttons.forEach(function (b) {
    b.addEventListener("click", function () {
      var want = b.getAttribute("data-filter");
      buttons.forEach(function (x) { x.setAttribute("aria-pressed", x === b ? "true" : "false"); });
      document.querySelectorAll(".dish").forEach(function (d) {
        var diets = (d.getAttribute("data-diet") || "").split(" ");
        d.hidden = !!want && diets.indexOf(want) === -1;
      });
    });
  });
})();
