import Widget from "resource:///com/github/Aylur/ags/widget.js";
import Gtk from "gi://Gtk?version=3.0";
import Cairo from "gi://cairo";
import Variable from "resource:///com/github/Aylur/ags/variable.js";

const CavaWave = ({
  height = 30,
  bars = 100,
  color = [0, 1, 0.5],
  smoothness = 0.7,
  fill = true,
} = {}) => Widget.DrawingArea({
  class_name: "cava-wave",
  hpack: "fill",
  setup: self => {
    self.set_size_request(-1, height);
    self.buffer = Array(bars).fill(0);
    
    self.cavaVar = Variable([], {
      listen: [
        ["bash", "-c", `
          printf "[general]
            bars=${bars}
            framerate=60
            [input]
            method=pulse
            [output]
            channels=mono
            method=raw
            raw_target=/dev/stdout
            data_format=ascii
            ascii_max_range=100" | 
          cava -p /dev/stdin
        `],
        out => out.split(";").slice(0, -1).map(Number)
      ]
    });
    self.cavaVar.connect("changed", () => {
      const newValues = self.cavaVar.value;
      if (newValues.length === bars) {
        self.buffer = self.buffer.map((val, i) => 
          val * smoothness + newValues[i] * (1 - smoothness)
        );
        self.queue_draw();
      }
    });
  },
  drawFn: (self, cr) => {
    const values = self.buffer;
    const width = self.get_allocated_width();
    const height = self.get_allocated_height();
    const spacing = width / (bars - 1);
    
    cr.setSourceRGB(color[0], color[1], color[2]);
    
    cr.moveTo(0, height - (values[0] / 100 * height));
    
    for (let i = 1; i < bars; i++) {
      const x = i * spacing;
      const y = height - (values[i] / 100 * height);
      const prevX = (i - 1) * spacing;
      const prevY = height - (values[i - 1] / 100 * height);
      
      cr.curveTo(
        prevX + spacing/2, prevY,
        prevX + spacing/2, y,
        x, y
      );
    }
    
    if (fill) {
      cr.lineTo(width, height);
      cr.lineTo(0, height);
      cr.closePath();
      
      const gradient = new Cairo.LinearGradient(0, 0, 0, height);
      gradient.addColorStopRGBA(0, color[0], color[1], color[2], 0.8);
      gradient.addColorStopRGBA(1, color[0], color[1], color[2], 0.2);
      cr.setSource(gradient);
      cr.fill();
    } else {
      cr.setLineWidth(1.5);
      cr.stroke();
    }
  }
});

export default {
  windows: [
    Widget.Window({
      name: 'cava',
      anchor: ['bottom', 'left', 'right'],
      exclusivity: 'ignore',
      child: CavaWave({
        height: 25,
        bars: 40,
        color: [0.1, 0.9, 1],
        smoothness: 0.1
      }),
    }),
  ],
};
