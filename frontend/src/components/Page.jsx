import React from "react";
import classNames from "classnames";
import "./Page.css";

const Page = React.forwardRef(({ data, left, cover }, ref) => {
  return (
    <>
      <div style={{ pointerEvents: "none" }} className="Page" ref={ref}>
        <div
          style={{
            background: `url(${data.background})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            width: "100%",
            height: "100%",
            position: "absolute",
            top: "0",
            zIndex: 2,
            boxShadow: cover
              ? ""
              : left
              ? "inset -13px 0px 38px -15px rgba(46,46,46,1)"
              : "inset 13px 0px 38px -15px rgba(46,46,46,1)",
          }}
        ></div>
        {data.text && (
          <div className={classNames("TextContainer", [data.text.position])}>
            <div className={classNames("Text", [data.text.class])}>
              {data.text.content}
            </div>
          </div>
        )}
      </div>
    </>
  );
});

export default Page;
