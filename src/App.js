import { motion, useMotionValue } from "framer-motion";
import { useEffect, useLayoutEffect, useRef, useState } from "react";

export default function App() {
  let [progress, setProgress] = useState(100);
  let min = 0;
  let max = 200;

  return (
    <div style={{ padding: 32, width: 320 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 16,
        }}
      >
        <span style={{ borderLeft: "1px solid rgb(34 197 94)" }}>{min}</span>
        <span style={{ borderLeft: "1px solid rgb(34 197 94)" }}>{max}</span>
      </div>

      <Slider min={min} max={max} value={progress} onChange={setProgress} />

      <div style={{ marginTop: 32 }}>
        <p>Current: {Math.floor(progress * 10) / 10}</p>
      </div>
      <div style={{ marginTop: 8 }}>
        <button
          style={{
            padding: "4px 8px",
            border: "1px solid rgb(229, 231, 235)",
            background: "white",
            borderRadius: 4,
          }}
          onClick={() => setProgress(50)}
        >
          Set to 50
        </button>
      </div>
    </div>
  );
}

function Slider({ min, max, value, onChange }) {
  let constraintsRef = useRef();
  let fullBarRef = useRef();
  let buttonSize = 10;
  let scrubberX = useMotionValue();

  function handleDrag(event) {
    let { left, width } = fullBarRef.current.getBoundingClientRect();
    let position = event.pageX - left;
    let newProgress = clamp(position, 0, width) / width;
    onChange(newProgress * (max - min));
  }

  // useEffect seems to fix it, but results in FOUC
  useLayoutEffect(() => {
    let { width } = fullBarRef.current.getBoundingClientRect();
    let newProgress = value / (max - min);
    let newX = newProgress * width;
    if (scrubberX.get() !== newX) {
      scrubberX.set(newProgress * width);
    }
  }, [value, scrubberX, max, min]);

  return (
    <div
      data-test="slider"
      style={{
        position: "relative",
        display: "flex",
        alignItems: "center",
        marginLeft: -buttonSize / 2,
        marginRight: -buttonSize / 2,
      }}
    >
      <div
        data-test="slider-constraints"
        ref={constraintsRef}
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          height: 2,
          borderRadius: 9999,
        }}
      />

      <div
        data-test="slider-background"
        style={{
          position: "absolute",
          display: "flex",
          alignItems: "center",
          left: buttonSize / 2,
          right: buttonSize / 2,
        }}
      >
        <div
          ref={fullBarRef}
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            display: "flex",
            alignItems: "center",
            padding: "4px 0",
          }}
        >
          <div
            style={{
              width: "100%",
              height: 2,
              background: "rgb(209 213 219)",
              borderRadius: 9999,
            }}
          />
        </div>
      </div>

      <motion.button
        data-test="slider-scrubber"
        drag="x"
        dragConstraints={constraintsRef}
        dragElastic={0}
        dragMomentum={false}
        onDrag={handleDrag}
        style={{
          x: scrubberX,
          top: -buttonSize / 2,
          width: buttonSize,
          height: buttonSize,
          padding: 0,
          background: "rgb(239 68 68)",
          border: "none",
          borderRadius: 9999,
        }}
      />
    </div>
  );
}

function clamp(number, min, max) {
  return Math.max(min, Math.min(number, max));
}
