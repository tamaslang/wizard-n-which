const isPhone = matchMedia("(pointer: coarse) and (max-width: 820px)").matches;

addEventListener("DOMContentLoaded", () => {
  const start = document.getElementById("start");
  const notice = document.getElementById("phone-notice");

  if (isPhone) {
    start.disabled = true;
    notice.hidden = false;
    return;
  }

  start.addEventListener("click", () => {
    // Character choice scene comes in the next milestone.
    console.info("Start pressed");
  });
});
