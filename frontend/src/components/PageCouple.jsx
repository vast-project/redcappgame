import React from "react";
import Page from "./Page";

const PageCouple = React.forwardRef(({ data }, ref) => {
  const isCover = data.id === 0;
  return (
    <>
      <Page ref={ref} data={data.pages[0]} left cover={isCover} />
      <Page
        ref={ref}
        data={data.pages[1]}
        choice={data.choice}
        cover={isCover}
      />
    </>
  );
});

export default PageCouple;
