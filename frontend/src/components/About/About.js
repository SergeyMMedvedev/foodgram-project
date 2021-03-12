import React from 'react';
import './About.css';
import '../appearAnimation/appearAnimation.css';
import myImage from '../../images/DSC01449.jpg';

function About() {
  return (
    <section className="about appearAnimationDelay">
      <img className="about__image" src={myImage} alt="Сергей Медведев" />
      <div className="about__info-container">
        <h2 className="about__title">Приветствую!</h2>
        <p className="about__text">
          Меня зовут Сергей Медведев. Я начинающий разработчкик.
        </p>
        <p className="about__text">
          Я окончил курсы &ldquo;веб-разработчик&ldquo; и &ldquo;python-разработчик&ldquo; от Яндекс.Практикума.
          В процессе прохождения курса веб-разработки приобрел следующие навыки:
          <ul>
            <li>HTML, CSS и JavaScript;</li>
            <li>методология БЭМ, адаптивная верстка;</li>
            <li>библиотека React;</li>
            <li>система управления версиями Git;</li>
            <li>фреймворк Express для бэк-енда.</li>
          </ul>
          В процессе прохождения курса python-разработки изучил:
          <ul>
            <li>Django;</li>
            <li>Django REST framwork, работа с внешними API;</li>
            <li>Алгоритмы и структуры данных;</li>
            <li>Инфраструктура бэкенд разработки - Docker, NGINX, Gunicorn, основы DevOps и CI, workflow и Git Actions.</li>
          </ul>
        </p>
      </div>
    </section>
  );
}

export default React.memo(About);
