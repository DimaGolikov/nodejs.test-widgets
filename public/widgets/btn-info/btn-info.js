(function() {
  var css = ["/widgets/btn-info/css/btn-info.css"],
    link = document.createElement("link"),
    head = document.getElementsByTagName("head")[0];
  link.rel = "stylesheet";

  var item;
  for (var i = 0; i < css.length; i++) {
    item = link.cloneNode(true);
    item.href = css[i];
    head.appendChild(item);
  }
})();

function btn_to_top(top, right, bottom, left, animate) {
  /* Кнопка прокрутки страницы */
  // Созаем кнопку
  var btn = [
    '<div id="btn-info" class="btn-info btn-info-clarity"><img src="/widgets/btn-info/img/btn-info.png" alt="top"></div>'
  ].join("");
  // Добавляем кнопку в body
  $("body").append(btn);
  // Позиционируем кнопку
  document
    .getElementById("btn-info")
    .setAttribute(
      "style",
      "right: " + right + "px; " + "bottom: " + bottom + "%;"
    );
  // Прячем кнопку при создании
  // $("#btn-info").hide();
  $(window).scroll(function() {
    // Событие прокрутки страницы
    if ($(this).scrollTop() > 100) {
      // Когда прокручивается 100 пикселей помещаем выше
      $("#btn-info").fadeIn();
    } else {
      // Когда прокручивается меньше 100 пикселей возвращаем на старую позицию
      $("#btn-info").fadeOut();
    }
  });
  $("#btn-info").click(function() {
    // Нажатие на кнопку - прокрутка страницы на верх
    $("body,html").animate(
      {
        scrollTop: 0
      },
      animate
    );
    return false;
  });
}
