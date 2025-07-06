import React from 'react';

const Dashboard = () => {
  return (
    <div style={{ width: '100%', height: 'calc(100vh - 50px)' }}>
      <iframe
        title="BatBrasil"
        width="100%"
        height="100%"
        src="https://app.powerbi.com/reportEmbed?reportId=aa3d1a68-8e8d-4e91-ba50-ffd280eae4cf&autoAuth=true&ctid=7aac3b2d-b64e-4b86-9902-e611a0d12ca5"
        frameBorder="0"
        allowFullScreen={true}
      />
    </div>
  );
};

export default Dashboard;
