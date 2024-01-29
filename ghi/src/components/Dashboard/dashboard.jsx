import React from 'react';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import Card from 'react-bootstrap/Card';
import './dashboard.css'; // Replace with the path to your CSS file

function Dashboard() {
  return (
    <div className="mt-4 center-card">
      <Card className="card-style">
        <Card.Header>
          <Tabs
            defaultActiveKey="profile"
            id="fill-tab-example"
            className="mb-3"
            fill
          >
            <Tab eventKey="home" title="Home">
              Tab content for Home
            </Tab>
            <Tab eventKey="profile" title="Profile">
              Tab content for Profile
            </Tab>
            <Tab eventKey="longer-tab" title="Loooonger Tab">
              Tab content for Loooonger Tab
            </Tab>
            <Tab eventKey="contact" title="Contact" disabled>
              Tab content for Contact
            </Tab>
          </Tabs>
        </Card.Header>
      </Card>
    </div>
  );
}

export default Dashboard;
