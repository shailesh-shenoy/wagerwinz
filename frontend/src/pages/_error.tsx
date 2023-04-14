import React from "react";
import { GetServerSideProps } from "next";

type Props = {
  statusCode: number;
};

const Error: React.FC<Props> = ({ statusCode }) => (
  <div className="error-container">
    {statusCode
      ? `An error ${statusCode} occurred on server`
      : "An error occurred on client"}
  </div>
);

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  let statusCode = 500;
  if (res?.statusCode) statusCode = res.statusCode;

  return {
    props: {
      statusCode,
    },
  };
};

export default Error;
