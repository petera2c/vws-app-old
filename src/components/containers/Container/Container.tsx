import React, { Ref } from "react";

interface Props {
  children: any;
  className?: string;
  forwardedRef2?: any;
  id?: string;
  onClick?: any;
  onScroll?: any;
  style?: any;
  testMode?: boolean;
}

const Container = ({
  children,
  className,
  forwardedRef2,
  id,
  onClick,
  onScroll,
  style,
  testMode,
}: {
  children?: any;
  className?: string;
  forwardedRef2?: Ref<any>;
  id?: string;
  onClick?: any;
  onScroll?: any;
  style?: any;
  testMode?: boolean;
}) => {
  if (testMode) className += " test-mode";

  return (
    <div
      className={`main-container light-scrollbar ${className}`}
      id={id}
      onClick={onClick}
      onScroll={onScroll}
      ref={forwardedRef2}
      style={style}
    >
      {children}
    </div>
  );
};

export default Container;
