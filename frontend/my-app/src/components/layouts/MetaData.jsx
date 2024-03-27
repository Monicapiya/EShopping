import { Helmet } from "react-helmet";

const MetaData = ({title} ) => {
  return (
    <Helmet>
      <title>{`${title} - EShopping`}</title>
    </Helmet>
  );
};

export default MetaData;