import Router from 'next/router';
import useRequest from '../../hooks/use-request';

const InfoShow = ({ info }) => {
  

  return (
    <div>
      <h1>{info.title}</h1>
      <h4>Content: {info.content}</h4>
      {errors}
    </div>
  );
};

TicketShow.getInitialProps = async (context, client) => {
  const { infoId } = context.query;
  const { data } = await client.get(`/api/infos/${infoId}`);

  return { info: data };
};

export default InfoShow;
