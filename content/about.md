Hello!

My name is **Raphael**, I'm <span id="age"></span>, both French & Australian, approximately based in Sydney.

Father of two, husband of one, second to none.
Technician at heart, with deep product and business understandings, both a specialist and a generalist, I thrive when creating systems, building teams, and scaling companies.

Say hi <span id="email"></span>.

<script>
(function() {
  var a = document.getElementById('age');
  if (a) {
    var d = new Date(), b = new Date(1977, 1, 20);
    a.textContent = Math.floor((d - b) / 31557600000);
  }
  var e = document.getElementById('email');
  if (e) {
    var u = 'ralovely', d = 'gmail.com';
    var l = document.createElement('a');
    l.href = 'mailto:' + u + '@' + d;
    l.textContent = 'here';
    e.appendChild(l);
  }
})();
</script>
