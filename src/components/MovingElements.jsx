import "../styles/animations.scss";

export function FloatingCircle({
  shape,
  className = "circle",
  diameter = 50,
  position = { top: 0, left: 0 },
}) {
  return (
    <div
      className={className}
      style={{ width: diameter, height: diameter, ...position }}
    >
      {shape === "donut" && (
        <div
          className="hole"
          style={{ width: diameter * 0.7, height: diameter * 0.7 }}
        ></div>
      )}
    </div>
  );
}
