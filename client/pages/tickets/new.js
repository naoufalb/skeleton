import { useState } from 'react';
import Router from 'next/router';
import useRequest from '../../hooks/use-request';

const NewInfo = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const { doRequest, errors } = useRequest({
    url: '/api/infos',
    method: 'post',
    body: {
      title,
      content,
    },
    onSuccess: () => Router.push('/'),
  });

  const onSubmit = (event) => {
    event.preventDefault();

    doRequest();
  };


  return (
    <div>
      <h1>Create an info</h1>
      <form onSubmit={onSubmit}>
        <div className="form-group">
          <label>Title</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="form-control"
          />
        </div>
        <div className="form-group">
          <label>Content</label>
          <input
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="form-control"
          />
        </div>
        {errors}
        <button className="btn btn-primary">Submit</button>
      </form>
    </div>
  );
};

export default NewInfo;
