import Navbar from '../componentes/Navbar.jsx';
import logo from '../assets/kartinglogo.png';
import { Button } from '@mui/material';
import { AttachMoney as TarifasIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import './Home.css';

function Home() {
    const navigate = useNavigate();

    const handleVerTarifas = () => {
        navigate('/customerfees'); 
    };

    return (
        <>
            <Navbar />
            <div sx={{ background: 'linear-gradient(90deg, #1e3c72, #aaa)', fontFamily: 'sans-serif' }}>
                <div className="home-content">
                    {/* Logo */}
                    <img src={logo} alt='Logo'/>
                    <h1 className='home-title'>KARTING RM</h1>
                    <h2>El lugar con los mejores Karts de Chile</h2>
                    
                    {/* Sección de bienvenida */}
                    <div className="welcome-section">
                        <p>Bienvenido</p>
                    </div>
                    
                    {/* Sección de incentivo a tarifas */}
                    <div className="tarifas-cta">
                        <h3 className="cta-title" style={{WebkitBackgroundClip: 'text', color: 'white' }}>¿Listo para la aventura?</h3>
                        <p className="cta-text">
                            Descubre nuestras tarifas competitivas y planes especiales 
                            diseñados para maximizar tu diversión en la pista.
                        </p>
                        <div className="cta-button-container">
                            <Button
                                variant="contained"
                                color="primary"
                                size="large"
                                startIcon={<TarifasIcon />}
                                onClick={handleVerTarifas}
                                className="cta-button"
                                to
                            >
                                Ver Tarifas
                            </Button>
                        </div>
                        <p className="cta-subtext">
                            Tarifas Diferenciadas para los fines de semana y feriados.
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Home;