
import { Link } from 'react-router'
import img_1 from '../assets/Img/1.jpeg'
import img_2 from '../assets/Img/2.jpeg'
import img_3 from '../assets/Img/3.jpeg'
import img_4 from '../assets/Img/4.jpeg'
import img_5 from '../assets/Img/5.jpeg'
import img_6 from '../assets/Img/6.jpeg'
import img_7 from '../assets/Img/7.jpeg'
import img_8 from '../assets/Img/8.jpeg'

export const Incio = () => {


    return (<>
        <div className="landing p-4">
            <div id="carouselExample" className="carousel slide" data-bs-ride="carousel">

                <div className="carousel-indicators">
                    <button type="button" data-bs-target="#carouselExample" data-bs-slide-to="0" className="active"></button>
                    <button type="button" data-bs-target="#carouselExample" data-bs-slide-to="1"></button>
                    <button type="button" data-bs-target="#carouselExample" data-bs-slide-to="2"></button>
                    <button type="button" data-bs-target="#carouselExample" data-bs-slide-to="3"></button>
                    <button type="button" data-bs-target="#carouselExample" data-bs-slide-to="4"></button>
                    <button type="button" data-bs-target="#carouselExample" data-bs-slide-to="5"></button>
                    <button type="button" data-bs-target="#carouselExample" data-bs-slide-to="6"></button>
                    <button type="button" data-bs-target="#carouselExample" data-bs-slide-to="7"></button>
                    {/* <button type="button" data-bs-target="#carouselExample" data-bs-slide-to="8"></button> */}
                </div>


                <div className="carousel-inner">
                    <div className="carousel-item active">
                        <img 
                        style={{borderRadius:'1rem'}}
                        src={img_1} className="d-block w-100" alt="Primera imagen" />
                        <div className="carousel-caption d-none d-md-block">
                            <h5>Gissela</h5>
                            <p>Vota por Gissela con el 70 al senado</p>
                        </div>
                    </div>
                    <div className="carousel-item">
                        <img 
                        style={{borderRadius:'1rem'}}
                        src={img_2} className="d-block w-100" alt="Segunda imagen" />
                    </div>
                    <div className="carousel-item">
                        <img 
                        style={{borderRadius:'1rem'}}
                        src={img_3} className="d-block w-100" alt="Tercera imagen" />
                    </div>
                    <div className="carousel-item">
                        <img 
                        style={{borderRadius:'1rem'}}
                        src={img_4} className="d-block w-100" alt="Tercera imagen" />
                    </div>
                    <div className="carousel-item">
                        <img 
                        style={{borderRadius:'1rem'}}
                        src={img_5} className="d-block w-100" alt="Tercera imagen" />
                    </div>
                    <div className="carousel-item">
                        <img 
                        style={{borderRadius:'1rem'}}
                        src={img_6} className="d-block w-100" alt="Tercera imagen" />
                    </div>
                    <div className="carousel-item">
                        <img 
                        style={{borderRadius:'1rem'}}
                        src={img_7} className="d-block w-100" alt="Tercera imagen" />
                    </div>
                    <div className="carousel-item">
                        <img 
                        style={{borderRadius:'1rem'}}
                        src={img_8} className="d-block w-100" alt="Tercera imagen" />
                    </div>
                </div>


                <button className="carousel-control-prev" type="button" data-bs-target="#carouselExample" data-bs-slide="prev">
                    <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                    <span className="visually-hidden">Anterior</span>
                </button>
                <button className="carousel-control-next" type="button" data-bs-target="#carouselExample" data-bs-slide="next">
                    <span className="carousel-control-next-icon" aria-hidden="true"></span>
                    <span className="visually-hidden">Siguiente</span>
                </button>
            </div>

            <div className="container-fluid mt-5">

                <Link className="btn btn-lg btn-warning w-100 fw-bold" to='/registro-votacion/crear'>
                    Click Aquí para registrarte
                </Link>
            </div>

        </div>

    </>)
}