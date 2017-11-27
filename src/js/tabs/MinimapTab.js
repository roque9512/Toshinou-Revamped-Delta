/*
Created by HaselLoyance on 26.11.2017
*/

class MinimapTab extends Tab {
  constructor(api, params = {}) {
    super(params);
    this._api = api;
    this._content.text('').append('<h4>Minimap</h4>');

    this.canvas = jQuery('<canvas/>', {
      width: jQuery('.panel').width(),
      height: 180,
    });

    this.ctx = this.canvas.get(0).getContext('2d');
    this._content.append(this.canvas);

    this.canvas.click((e) => {
      const pos = this._content.position();
      const x = e.clientX - pos.left;
      const y = e.clientY - pos.top - 40;

      Injector.injectScript('document.getElementById("preloader").moveShip(' + x * 70 + ',' + y * 90 + ');');
    });
  }

  draw() {
    const ct = this.ctx;

    ct.clearRect(0, 0, this.canvas.width() + 40, this.canvas.height() + 40);

    ct.fillStyle = 'green';
    ct.fillRect(window.hero.position.x / 70, window.hero.position.y / 90, 4, 4);

    // TODO: someone should make this look nicer
    for (var property in this._api.boxes) {
      var box = this._api.boxes[property];

      if (box == null)
        continue;

      ct.fillStyle = BoxType.getColor(box.type);

      ct.fillRect(box.position.x / 70, box.position.y / 90, 2, 2);
    }

    for (var property in this._api.ships) {
      var ship = this._api.ships[property];

      if (ship == null)
        continue;

      ship.update();
      var pos = ship.position;

      if (ship.isNpc) {
        ct.fillStyle = "rgb(255, 0, 245)";
      } else if (ship.isEnemy) {
        ct.fillStyle = "rgb(74, 0, 0)";
      } else {
        ct.fillStyle = "rgb(0, 125, 255)";
      }

      this._fillCircle(ct, pos.x / 70, pos.y / 90, 2);
    }


    ct.strokeStyle = 'white';
    ct.lineWidth = 1;

    this._api.gates.forEach(gate => {
      const pos = gate.position;
      this._strokeCircle(ct, pos.x / 70, pos.y / 90, 4);
    });
  }

  _fillCircle(ctx, x, y, r) {
    this._drawCircle(ctx, x, y, r);
    ctx.fill();
  }

  _strokeCircle(ctx, x, y, r) {
    this._drawCircle(ctx, x, y, r);
    ctx.stroke();
  }

  _drawCircle(ctx, x, y, r) {
    ctx.beginPath();
    ctx.arc(x, y, r, 0, 2 * Math.PI, false);
  }
}