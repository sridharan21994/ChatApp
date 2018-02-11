import React from 'react';
import { Card, CardTitle } from 'material-ui/Card';


const HomePage = () => (
  <Card className={isDesktop?"container":"container-sm"}>
    <CardTitle title="React Application" subtitle="This is the home page." />
  </Card>
);

export default HomePage;
