import { useState } from 'react';

const Accordion = ({ title, content }) => {
  const [isActive, setIsActive] = useState(false);

  const toggleAccordion = () => {
    setIsActive(!isActive);
  };

  return (
    <div className={`accordion-item ${isActive ? 'active' : ''}`}>
      <div className="accordion-header" onClick={toggleAccordion}>
        {title}
      </div>
      <div className="accordion-content">
        {isActive && <p>{content}</p>}
      </div>
    </div>
  );
};

export default Accordion;
