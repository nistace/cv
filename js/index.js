function init() {
  $("#btn-cv").on("click", function() {
    location.href = 'cv';
  });
  $("#btn-ludumdare").on("click", function() {
    location.href = 'ludumdare';
  });
  $("#btn-dunno").on("click", function() {
    alert("What are your goals, objectives and ambitions? If that reflexion don't help you, maybe you should try to click a random button then... Who knows what can happen?");
  });
}

$(init);
