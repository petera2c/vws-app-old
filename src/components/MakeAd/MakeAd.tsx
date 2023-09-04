// import AdSense from "react-adsense";

function MakeAd({ banner, className, layoutKey, slot }: any) {
  if (banner) {
    if (process.env.NODE_ENV === "production")
      return (
        <div className={"w-full flex flex-col " + className}>
          {/* <AdSense.Google
            className="adsbygoogle"
            client="ca-pub-5185907024931065"
            format="fluid"
            layoutKey={layoutKey}
            responsive="true"
            slot={slot}
            style={{
              display: "block",
              minWidth: "240px",
              width: "100%",
              maxWidth: "1000px",
              minHeight: "100px",
              height: "180px",
              maxHeight: "300px",
            }}
          /> */}
        </div>
      );
    else
      return (
        <div
          className={"flex full-center w-full test3 br8 " + className}
          style={{
            minWidth: "100px",
            width: "100%",
            maxWidth: "1000px",
            minHeight: "100px",
            height: "180px",
            maxHeight: "800px",
          }}
        >
          <h1>Ad</h1>
        </div>
      );
  } else {
    if (process.env.NODE_ENV === "production")
      return (
        <div className={"w-full " + className}>
          {/* <AdSense.Google
            className="adsbygoogle"
            client="ca-pub-5185907024931065"
            format=""
            responsive="true"
            slot={slot}
            style={{
              display: "block",
              minWidth: "100px",
              width: "100%",
              maxWidth: "1000px",
              minHeight: "100px",
              height: "240px",
              maxHeight: "800px",
            }}
          /> */}
        </div>
      );
    else
      return (
        <div
          className={"flex full-center test3 br8 " + className}
          style={{
            minWidth: "100px",
            width: "100%",
            maxWidth: "1000px",
            minHeight: "100px",
            height: "240px",
            maxHeight: "800px",
          }}
        >
          <h1>Ad</h1>
        </div>
      );
  }
}

export default MakeAd;
