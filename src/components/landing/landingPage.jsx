import React from 'react';
import { Link } from 'react-router-dom';

import './theme.scss';
// import './animate.css';
// import './bootstrap.css';
// import './owl.carousel.css';
// import './maicons.css';
import bgImage from './bg_image_1.png';
// Import images if they are in the src folder
import iconPattern from './icon_pattern.svg';
import person1 from './person_1.jpg';
import person2 from './person_2.jpg';


const LandingPage = () => {
  return (
    <>
      <header>
        <nav className="navbar navbar-expand-lg navbar-light navbar-float">
          <div className="container">
            <Link to="/" className="navbar-brand">Domova<span className="text-primary">Kniga</span></Link>

            <button className="navbar-toggler" data-toggle="collapse" data-target="#navbarContent" aria-controls="navbarContent" aria-expanded="false" aria-label="Toggle navigation">
              <span className="navbar-toggler-icon"></span>
            </button>
          </div>
        </nav>

        <div className="page-banner home-banner">
          <div className="container h-100">
            <div className="row align-items-center h-100">
              <div className="col-lg-6 py-3 wow fadeInUp">
                <h1 className="mb-4">Домова книга</h1>
                <p className="text-lg mb-5">Нашето приложение "Домова книга" предоставя удобно и ефективно решение за домоуправители, собственици и мениджъри на сгради, като улеснява управлението на всички важни данни, свързани с даден имот.</p>

                <Link to="/login">Вход</Link> | <Link to="/signup">Регистрация</Link>
              </div>
              <div className="col-lg-6 py-3 wow zoomIn">
                <div className="img-place">
                  <img src={bgImage} alt="Background" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main>
        <div className="page-section features">
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-md-6 col-lg-4 py-3 wow fadeInUp">
                <div className="d-flex flex-row">
                  <div className="img-fluid mr-3">
                    <img src={iconPattern} alt="Icon" />
                  </div>
                  <div>
                    <h4>Какво представлява "Домова книга"?</h4>
                    <p>"Домова книга" е дигитална платформа, която централизира информацията за сгради, имоти и техните обитатели. Чрез нея можеш да съхраняваш и управляваш информация за адреси, собственици, наематели, плащания, ремонти и важни събития.</p>
                  </div>
                </div>
              </div>

              <div className="col-md-6 col-lg-4 py-3 wow fadeInUp">
                <div className="d-flex flex-row">
                  <div className="img-fluid mr-3">
                    <img src={iconPattern} alt="Icon" />
                  </div>
                  <div>
                    <h4> Основни функционалности на приложението</h4>
                      <p>
                        ✔ Управление на адреси и сгради<br/>
                        ✔ Управление на собственици и наематели<br/>
                        ✔ Поддръжка на финансови данни
                      </p>
                  </div>
                </div>
              </div>

              <div className="col-md-6 col-lg-4 py-3 wow fadeInUp">
                <div className="d-flex flex-row">
                  <div className="img-fluid mr-3">
                    <img src={iconPattern} alt="Icon" />
                  </div>
                  <div>
                    <h4>За кого е предназначено приложението?</h4>
                    {/* <p>Copywrite, blogpublic realations content translation.</p> */}
                    <p>
                      ✔ Домоуправители – за по-лесно управление на входове и блокове<br/>
                      ✔ Мениджъри на сгради – за контрол на няколко обекта наведнъж<br/>
                      ✔ Собственици на няколко имота – за проследяване на наематели и плащания<br/>
                      ✔ Фирми за управление на недвижими имоти – за централизирано управление на данни
                    </p>

                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <div className="page-section">
        <div className="container">
          <div className="text-center wow fadeInUp">
            <div className="subhead">Защо да избереш "Домова книга"?</div>
            <h2 className="title-section">Регистрирай се напълно <span className="marked">безплатно</span></h2>
            <div className="divider mx-auto"></div>
          </div>
    
          <div className="row mt-5 text-center">
            <div className="col-lg-4 py-3 wow fadeInUp">
              <div className="display-3"><span className="mai-shapes"></span></div>
              <h5>Спестяване на  време</h5>
              <p>Елиминира нуждата от тетрадки и хаотично водене на записки</p>
            </div>
            <div className="col-lg-4 py-3 wow fadeInUp">
              <div className="display-3"><span className="mai-shapes"></span></div>
              <h5>Достъпност от всяко устройство </h5>
              <p>Използвай я на компютър, таблет или телефон</p>
            </div>
            <div className="col-lg-4 py-3 wow fadeInUp">
              <div className="display-3"><span className="mai-shapes"></span></div>
              <h5>Лесен и интуитивен интерфейс</h5>
              <p>Подходящ за всеки, без сложни настройки</p>
            </div>
          </div>
        </div>
      </div>

      {/* <div className="page-section bg-light">
        <div className="container">
          
          <div className="owl-carousel wow fadeInUp" id="testimonials">
            <div className="item">
              <div className="row align-items-center">
                <div className="col-md-6 py-3">
                  <div className="testi-image">
                    <img src={person2} alt="Person 1" />
                  </div>
                </div>
                <div className="col-md-6 py-3">
                  <div className="testi-content">
                    <p>Necessitatibus ipsum magni accusantium consequatur delectus a repudiandae nemo quisquam dolorum itaque, tenetur, esse optio eveniet beatae explicabo sapiente quo.</p>
                    <div className="entry-footer">
                      <strong>Melvin Platje</strong> &mdash; <span className="text-grey">CEO Slurin Group</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
    
            <div className="item">
              <div className="row align-items-center">
                <div className="col-md-6 py-3">
                  <div className="testi-image">
                    <img src={person1} alt="Person 2" />
                  </div>
                </div>
                <div className="col-md-6 py-3">
                  <div className="testi-content">
                    <p>Repudiandae vero assumenda sequi labore ipsum eos ducimus provident a nam vitae et, dolorum temporibus inventore quaerat consectetur quos! Animi, qui ratione?</p>
                    <div className="entry-footer">
                      <strong>George Burke</strong> &mdash; <span className="text-grey">CEO Letro</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
    
          </div>
        </div>
      </div>  */}

      <footer className="page-footer">
        <div className="container">
          <div className="row">
            <div className="col-sm-6 py-2">
              <p id="copyright">&copy; 2020 <a href="https://macodeid.com/">MACode ID</a>. All rights reserved</p>
            </div>
            <div className="col-sm-6 py-2 text-right">
              <div className="d-inline-block px-3">
                <a href="#">Privacy</a>
              </div>
              <div className="d-inline-block px-3">
                <a href="#">Contact Us</a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default LandingPage;
