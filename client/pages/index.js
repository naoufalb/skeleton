import Link from 'next/link';

const LandingPage = ({ currentUser, infos }) => {
  const infoList = infos.map((info) => {
    return (
      <tr key={info.id}>
        <td>{info.title}</td>
        <td>{info.content}</td>
        <td>
          <Link href="/infos/[ticketId]" as={`/infos/${info.id}`}>
            <a>View</a>
          </Link>
        </td>
      </tr>
    );
  });

  return (
    <div>
      <h1>Infos</h1>
      <table className="table">
        <thead>
          <tr>
            <th>Title</th>
            <th>content</th>
            <th>Link</th>
          </tr>
        </thead>
        <tbody>{infoList}</tbody>
      </table>
    </div>
  );
};

LandingPage.getInitialProps = async (context, client, currentUser) => {
  const { data } = await client.get('/api/infos');

  return { infos: data };
};

export default LandingPage;
