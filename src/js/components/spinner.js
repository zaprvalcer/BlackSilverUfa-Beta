import React from 'react';
import { Spinner as SpinnerComponent } from 'react-bootstrap';

export const Spinner = () => (
  <div className="flex-grow-1 d-flex justify-content-center align-items-center">
    <SpinnerComponent variant="primary" animation="border" size="xl" />
  </div>
);
