function RuleEditor(interpreter, initialAxiom, initialRules, initialLevel) {
  this.interpreter = interpreter;
  this.axiom = initialAxiom;
  this.rules = initialRules;
  this.level = initialLevel;
  this.angle = interpreter.angle;
  this.distance = interpreter.distance;
  this.template = (
    document.getElementById('settings-template').innerHTML
  );

  this.run();
}

RuleEditor.prototype.renderTo = function (el) {
  el.innerHTML = this.template;

  el.querySelector('.axiom').value = this.axiom;
  el.querySelector('.iterations').value = this.level;
  el.querySelector('.distance').value = this.distance;
  el.querySelector('.angle').value = this.angle;
  el.querySelector('.rules').value = this.rules.map(
    function (rule) {
      return rule[0] + ' => ' + rule[1];
    }
  ).join('\n');

  this.bindEvents(el);
  this.renderCurrentRanges(el);
}

RuleEditor.prototype.renderCurrentRanges = function (el) {
  Array.prototype.forEach.call(
    el.querySelectorAll('.angle, .distance, .iterations'),
    function (range) {
      range.nextElementSibling.innerHTML = range.value;
    }
  );
}

RuleEditor.prototype.bindEvents = function (el) {
  var events = {
    '.distance input': this.handleDistance,
    '.rules keyup': this.handleRules,
    '.axiom keyup': this.handleAxiom,
    '.angle input': this.handleAngle,
    '.iterations input': this.handleIterations,
  };

  Object.keys(events).forEach(function (key) {
    var parts = key.split(' ');
    el.querySelector(
      parts[0]
    ).addEventListener(
      parts[1],
      events[key].bind(this, el)
    );
  }.bind(this));
}

RuleEditor.prototype.handleIterations = function (el, event) {
  this.level = event.target.value;
  this.renderCurrentRanges(el);
  this.run();
}

RuleEditor.prototype.handleAngle = function (el, event) {
  this.angle = event.target.value;
  this.renderCurrentRanges(el);
  this.run();
}

RuleEditor.prototype.handleDistance = function (el, event) {
  this.distance = event.target.value;
  this.renderCurrentRanges(el);
  this.run();
}

RuleEditor.prototype.handleAxiom = function (el, event) {
  this.axiom = event.target.value;
  this.run();
}

RuleEditor.prototype.handleRules = function (el, event) {
  var lines = event.target.value.split('\n');

  this.rules = lines.map(function (rule) {
    return rule.split('=>').map(function (part) {
      return part.trim();
    });
  });

  this.run();
}

RuleEditor.prototype.run = function () {
  this.interpreter.clear();
  this.interpreter.angle = this.angle;
  this.interpreter.distance = this.distance;
  this.interpreter.run(this.axiom, this.rules, this.level);
}
