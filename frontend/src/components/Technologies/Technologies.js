import React from 'react';
import './Technologies.css';
import '../appearAnimation/appearAnimation.css';

function Technologies() {
  return (
    <section className="technologies">
      <div className="technologies__grid appearAnimation">
        <div className="technologies__icon technologies__icon_django" />
        <div className="technologies__icon technologies__icon_docker" />
        <div className="technologies__icon technologies__icon_python" />
        <div className="technologies__icon technologies__icon_postgresql" />
        <div className="technologies__icon technologies__icon_git" />
        <div className="technologies__icon technologies__icon_react" />
        <div className="technologies__icon technologies__icon_js" />
        <div className="technologies__icon technologies__icon_html" />
        <div className="technologies__icon technologies__icon_css" />
        <div className="technologies__icon technologies__icon_github" />
        <div className="technologies__icon technologies__icon_nginx" />
        <div className="technologies__icon technologies__icon_gunicorn" />
      </div>
    </section>

  );
}

export default React.memo(Technologies);
