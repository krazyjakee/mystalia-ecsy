import React, { useState } from "react";
import { createUseStyles } from "react-jss";
import { guiAssetPath } from "../cssUtilities";
import { whiteText } from "../palette";
import classnames from "classnames";
import { Rnd, Props } from "react-rnd";

const useStyles = createUseStyles({
  container: {
    position: "relative",
    minWidth: 300,
    minHeight: 250,
    boxSizing: "border-box",
    padding: "0 18px",
    display: "flex",
    flexDirection: "column",
    height: "100%",
  },
  border: {
    position: "relative",
    flex: 1,
    display: "flex",
    backgroundImage: guiAssetPath("panel/panel-bg.png"),
    backgroundSize: "cover",
    height: "100%",
    width: "100%",
    "&:after": {
      boxSizing: "border-box",
      position: "absolute",
      height: "100%",
      width: "100%",
      content: '""',
      display: "block",
      borderStyle: "solid",
      borderWidth: 57,
      borderImageSource: guiAssetPath("panel/panel-border.png"),
      borderImageSlice: 57,
      borderImageRepeat: "round",
    },
  },
  header: {
    position: "relative",
    height: 59,
    backgroundImage: guiAssetPath("panel/panel-heading-bg.png"),
    backgroundRepeat: "repeat-x",
    backgroundPosition: "0 13px",
    "&:before, &:after": {
      content: '""',
      position: "absolute",
      bottom: -8,
      width: 130,
      height: 67,
      backgroundImage: guiAssetPath("panel/panel-heading-side.png"),
    },
    "&:before": {
      left: -18,
    },
    "&:after": {
      right: -18,
      transform: "scaleX(-1)",
    },
  },
  labelContainer: {
    height: 0,
    textAlign: "center",
  },
  label: {
    display: "inline-block",
    position: "relative",
    zIndex: 1,
    height: 27,
    padding: "8px 39px",
    backgroundImage: guiAssetPath("panel/panel-label-bg.png"),
    backgroundRepeat: "repeat-x",
    ...whiteText,
    "&:before, &:after": {
      content: '""',
      position: "absolute",
      bottom: 3,
      width: 39,
      height: 42,
      backgroundImage: guiAssetPath("panel/panel-label-side.png"),
    },
    "&:before": {
      left: -18,
    },
    "&:after": {
      right: -18,
      transform: "scaleX(-1)",
    },
  },
  closeBtn: {
    position: "absolute",
    right: 5,
    top: 10,
    zIndex: 1,
    width: 37,
    height: 37,
    backgroundImage: guiAssetPath("panel/close-btn.png"),
    cursor: "pointer",
  },
  content: {
    flex: 1,
    padding: 25,
    zIndex: 1,
  },
});

const makeRnd = (children: React.ReactNode, rndOptions: Props) => {
  const [width, setWidth] = useState(rndOptions.defaultWidth);
  const [height, setHeight] = useState(rndOptions.defaultHeight);
  const [x, setX] = useState(20);
  const [y, setY] = useState(20);

  return (
    <Rnd
      size={{ width, height }}
      position={{ x, y }}
      onDragStop={(_, d) => {
        setX(d.x);
        setY(d.y);
      }}
      onResizeStop={(_, direction, ref, delta, position) => {
        setWidth(ref.style.width);
        setHeight(ref.style.height);
        setX(position.x);
        setY(position.y);
      }}
      dragHandleClassName="panelDragHandle"
      resizeHandleStyles={{
        top: {
          top: 59,
        },
        topLeft: {
          top: 59,
          left: 18,
        },
        topRight: {
          top: 59,
          right: 18,
        },
        bottom: {
          bottom: 0,
        },
        bottomLeft: {
          bottom: 0,
          left: 18,
        },
        bottomRight: {
          right: 18,
        },
        left: {
          left: 18,
        },
        right: {
          right: 18,
        },
      }}
      {...rndOptions}
    >
      {children}
    </Rnd>
  );
};

type PanelProps = {
  isDraggable?: boolean;
  rndOptions?: Props;
  onCloseClick?: VoidFunction;
} & React.HTMLAttributes<HTMLDivElement>;

export const BasePanel = (props: PanelProps) => {
  const classes = useStyles();

  const panel = (
    <div className={classes.container} {...props}>
      <div className={classes.labelContainer}>
        {props.title && <span className={classes.label}>{props.title}</span>}
      </div>
      <div className={classnames(classes.header, "panelDragHandle")}>
        <div className={classes.closeBtn} onClick={props.onCloseClick}></div>
      </div>
      <div className={classes.border}>
        <div className={classes.content}>{props.children}</div>
      </div>
    </div>
  );

  return props.isDraggable ? makeRnd(panel, props.rndOptions || {}) : panel;
};
