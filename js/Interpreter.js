function Interpreter(canvas, angle, distance, contextOptions, colors) {
  this.canvas = canvas;
  this.context = canvas.getContext('2d');

  this.colorIndex = 0;
  this.colorStack = [];
  this.colors = colors || (
    ["black", "red", 'yellow', 'blue']
  );

  this.contextOptions = Object.assign({
    lineCap: 'square',
    lineWidth: 2,
  }, contextOptions);

  this.angle = angle || 45;
  this.distance = distance || 15;
}

Interpreter.prototype.iterate = function (axiom, rules, level) {
  return Array(
    Number(level)
  ).fill(
    axiom
  ).reduce(
    function (prev, current) {
      return rules.reduce(
        function (prev, rule) {
          return prev.replace(
            new RegExp(rule[0], 'g'),
            rule[1]
          );
        },
        prev
      );
    },
    axiom
  );
}

Interpreter.prototype.setup = function () {
  var context = this.context,
      canvas = this.canvas,
      contextOptions = this.contextOptions;

  this.clear();
  context.beginPath();
}

Interpreter.prototype.clear = function () {
  var contextOptions = this.contextOptions,
      context = this.context;

  this.context.setTransform(1, 0, 0, 1, 0, 0);

  this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

  this.context.translate(
    this.canvas.width / 2,
    this.canvas.height / 2
  );

  this.context.scale(2, 2);

  Object.keys(contextOptions).forEach(function (key) {
    context[key] = contextOptions[key];
  });
};

Interpreter.prototype.run = function (axiom, rules, level, ignoreSetup) {
  Array.prototype.forEach.call(
    this.iterate(axiom, rules, level),
    this.interpret.bind(this)
  );

  return this;
};

Interpreter.prototype.interpret = function (action) {
  var distance = this.distance,
      colorStack = this.colorStack,
      colorIndex = this.colorIndex,
      colors = this.colors,
      angle = this.angle,
      context = this.context;
  

  switch (action) {
    case 'F':
      context.moveTo(0, 0);
      context.lineTo(0, distance);
      context.translate(0, distance);
      break;

    case 'f':
      context.moveTo(0, 0);
      context.lineTo(0, distance / 2);
      context.translate(0, distance / 2);
      break;

    case 'M':
      // context.rect(0, 0, 1, 1);
      context.translate(0, distance);
      break;

    case 'm':
      context.translate(0, distance/2);
      break;

    case '+':
      context.rotate(toRadian(angle));
      break;

    case '-':
      context.rotate(toRadian(-angle));
      break;

    case '[':
      context.save();
      break;

    case ']':
      context.lineJoin = "round";
      context.lineWidth = 4;
      context.restore();
      context.stroke();
      context.beginPath()
      break;

    case 'J':
      context.translate(0, distance);
      break;

    case '=':
      context.scale(-1,1);
      break;

    case '|':
      context.scale(1, -1);
      break;

    case 'Z':
      this.distance = distance / 1.5;
      break;

    case 'O':
      this.distance = distance * 1.5;
      break;

    case 'S':
      if (++this.colorIndex === colors.length - 1) {
        this.colorIndex = 0;
      };

      context.strokeStyle = colors[this.colorIndex];
      break;
    
    case '{':
      colorStack.push(colorIndex);
      break;

    case '}':
      this.colorIndex = colorStack.pop();
      context.strokeStyle = colors[this.colorIndex];
      context.stroke();
      break;
  }
}
