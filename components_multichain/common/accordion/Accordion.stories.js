import React from 'react';

import Accordion from './Accordion';

export default {
  title: 'Common/Accordion',
  component: Accordion,
  argTypes: {},
};

const Template = (args) => <Accordion {...args} />;

export const Default = Template.bind({});
Default.args = {
  items: [
    {
      id: 1,
      title: 'Item 1 Title',
      body:
        'This is test body. Now lets make it long.This is test body. Now lets make it long.This is test body. Now lets make it long.This is test body. Now lets make it long.',
    },
    {
      id: 2,
      title: 'Item 2 Title',
      body: (
        <div>
          {' '}
          Its another HTML <div>With more child elements</div>
          <div>With more child elements</div>
          <div>With more child elements</div>
          <div>With more child elements</div>
          <div>With more child elements</div>
          <div>With more child elements</div>
          <div>With more child elements</div>
          <div>With more child elements</div>
          <div>With more child elements</div>
          <div>With more child elements</div>
          <div>With more child elements</div>
          <div>With more child elements</div>
          <div>With more child elements</div>
        </div>
      ),
    },
  ],
};
