import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom';
import Button from '@mui/material/Button';
import { FaAngleRight } from "react-icons/fa6";
import { IoMdNotificationsOutline } from "react-icons/io";
import { MdOutlineDashboard } from "react-icons/md";
import { IoSettingsOutline } from "react-icons/io5";
import { IoMdLogOut } from "react-icons/io";
import { FaKeyboard, FaFolder, FaHeadset, FaCalendarAlt, FaChartBar } from "react-icons/fa";

const SidBar = () => {
    const [activeTab, setActiveTab] = useState<number>(0);
    const [isToggleSubmenuProjet, setIsToggleSubmenuProjet] = useState(false);
    const [isToggleSubmenuUsers, setIsToggleSubmenuUsers] = useState(false);
    const [isToggleSubmenuSuivi, setIsToggleSubmenuSuivi] = useState(false);
    const [isToggleSubmenuPrestataires, setIsToggleSubmenuPrestataires] = useState(false);
    const [isToggleSubmenuContratPaiement, setIsToggleSubmenuContratPaiement] = useState(false);
    const [isToggleSubmenuDocumentation, setIsToggleSubmenuDocumentation] = useState(false);
    const [isToggleSubmenuReporting, setIsToggleSubmenuReporting] = useState(false);
    const [isToggleSubmenuAudit, setIsToggleSubmenuAudit] = useState(false);

    // Charger l'état depuis localStorage au montage du composant
    useEffect(() => {
        const savedActiveTab = localStorage.getItem('activeTab');
        const savedToggleSubmenuProjet = localStorage.getItem('isToggleSubmenuProjet');
        const savedToggleSubmenuUsers = localStorage.getItem('isToggleSubmenuUsers');
        const savedToggleSubmenuSuivi = localStorage.getItem('isToggleSubmenuSuivi');
        const savedToggleSubmenuPrestataires = localStorage.getItem('isToggleSubmenuPrestataires');
        const savedToggleSubmenuContratPaiement = localStorage.getItem('isToggleSubmenuContratPaiement');
        const savedToggleSubmenuDocumentation = localStorage.getItem('isToggleSubmenuDocumentation');
        const savedToggleSubmenuReporting = localStorage.getItem('isToggleSubmenuReporting');
        const savedToggleSubmenuAudit = localStorage.getItem('isToggleSubmenuAudit');

        if (savedActiveTab) setActiveTab(parseInt(savedActiveTab));
        if (savedToggleSubmenuProjet) setIsToggleSubmenuProjet(savedToggleSubmenuProjet === 'true');
        if (savedToggleSubmenuUsers) setIsToggleSubmenuUsers(savedToggleSubmenuUsers === 'true');
        if (savedToggleSubmenuSuivi) setIsToggleSubmenuSuivi(savedToggleSubmenuSuivi === 'true');
        if (savedToggleSubmenuPrestataires) setIsToggleSubmenuPrestataires(savedToggleSubmenuPrestataires === 'true');
        if (savedToggleSubmenuContratPaiement) setIsToggleSubmenuContratPaiement(savedToggleSubmenuContratPaiement === 'true');
        if (savedToggleSubmenuDocumentation) setIsToggleSubmenuDocumentation(savedToggleSubmenuDocumentation === 'true');
        if (savedToggleSubmenuReporting) setIsToggleSubmenuReporting(savedToggleSubmenuReporting === 'true');
        if (savedToggleSubmenuAudit) setIsToggleSubmenuAudit(savedToggleSubmenuAudit === 'true');
    }, []);

    const isOpenSubmenu = (index: number) => {
        // Réinitialiser tous les sous-menus
        setIsToggleSubmenuProjet(false);
        setIsToggleSubmenuUsers(false);
        setIsToggleSubmenuSuivi(false);
        setIsToggleSubmenuPrestataires(false);
        setIsToggleSubmenuContratPaiement(false);
        setIsToggleSubmenuDocumentation(false);
        setIsToggleSubmenuReporting(false);
        setIsToggleSubmenuAudit(false);

        // Activer le sous-menu correspondant à l'index
        switch(index) {
            case 1:
                setIsToggleSubmenuProjet(!isToggleSubmenuProjet);
                break;
            case 2:
                setIsToggleSubmenuUsers(!isToggleSubmenuUsers);
                break;
            case 3:
                setIsToggleSubmenuSuivi(!isToggleSubmenuSuivi);
                break;
            case 4:
                setIsToggleSubmenuPrestataires(!isToggleSubmenuPrestataires);
                break;
            case 5:
                setIsToggleSubmenuContratPaiement(!isToggleSubmenuContratPaiement);
                break;
            case 6:
                setIsToggleSubmenuDocumentation(!isToggleSubmenuDocumentation);
                break;
            case 7:
                setIsToggleSubmenuReporting(!isToggleSubmenuReporting);
                break;
            case 8:
                setIsToggleSubmenuAudit(!isToggleSubmenuAudit);
                break;
        }

        // Mettre à jour l'onglet actif
        setActiveTab(index);

        // Sauvegarder dans localStorage
        localStorage.setItem('activeTab', index.toString());
        localStorage.setItem('isToggleSubmenuProjet', (index === 1 ? !isToggleSubmenuProjet : false).toString());
        localStorage.setItem('isToggleSubmenuUsers', (index === 2 ? !isToggleSubmenuUsers : false).toString());
        localStorage.setItem('isToggleSubmenuSuivi', (index === 3 ? !isToggleSubmenuSuivi : false).toString());
        localStorage.setItem('isToggleSubmenuPrestataires', (index === 4 ? !isToggleSubmenuPrestataires : false).toString());
        localStorage.setItem('isToggleSubmenuContratPaiement', (index === 5 ? !isToggleSubmenuContratPaiement : false).toString());
        localStorage.setItem('isToggleSubmenuDocumentation', (index === 6 ? !isToggleSubmenuDocumentation : false).toString());
        localStorage.setItem('isToggleSubmenuReporting', (index === 7 ? !isToggleSubmenuReporting : false).toString());
        localStorage.setItem('isToggleSubmenuAudit', (index === 8 ? !isToggleSubmenuAudit : false).toString());
    } 

    return (
        <>
            <div className="sidebar">
                <div className="sidebar-content">
                    <ul className="list-unstyled">
                        {/* Tableau de Bord */}
                        <li>
                            <Link to="/home">
                                <Button className={`w-100 ${activeTab === 0 ? 'active' : ''}`} onClick={() => isOpenSubmenu(0)}>
                                    <span className='icon'><MdOutlineDashboard /></span>
                                    Tableau de Bord 
                                    <span className='arrow'><FaAngleRight /></span>
                                </Button>
                            </Link>
                        </li>
                        
                        {/* Saisie Données */}
                        <li>
                            <Link to="/home">
                                <Button className={`w-100 ${activeTab === 1 ? 'active' : ''}`} onClick={() => isOpenSubmenu(1)}>
                                    <span className='icon'><FaKeyboard /></span>
                                    Saisie Données
                                    <span className='arrow'><FaAngleRight /></span>
                                </Button>
                            </Link>
                        </li>

                        {/* Documents */}
                        <li>
                            <Link to="/home">
                                <Button className={`w-100 ${activeTab === 2 ? 'active' : ''}`} onClick={() => isOpenSubmenu(2)}>
                                    <span className='icon'><FaFolder /></span>
                                    Documents
                                    <span className='arrow'><FaAngleRight /></span>
                                </Button>
                            </Link>
                        </li>

                        {/* Support */}
                        <li>
                            <Link to="/home">
                                <Button className={`w-100 ${activeTab === 3 ? 'active' : ''}`} onClick={() => isOpenSubmenu(3)}>
                                    <span className='icon'><FaHeadset /></span>
                                    Support
                                    <span className='arrow'><FaAngleRight /></span>
                                </Button>
                            </Link>
                        </li>

                        {/* Planning */}
                        <li>
                            <Link to="/home">
                                <Button className={`w-100 ${activeTab === 4 ? 'active' : ''}`} onClick={() => isOpenSubmenu(4)}>
                                    <span className='icon'><FaCalendarAlt /></span>
                                    Planning
                                    <span className='arrow'><FaAngleRight /></span>
                                </Button>
                            </Link>
                        </li>

                        {/* Rapports */}
                        <li>
                            <Link to="/home">
                                <Button className={`w-100 ${activeTab === 5 ? 'active' : ''}`} onClick={() => isOpenSubmenu(5)}>
                                    <span className='icon'><FaChartBar /></span>
                                    Rapports
                                    <span className='arrow'><FaAngleRight /></span>
                                </Button>
                            </Link>
                        </li>

                        {/* Notifications */}
                        <li>
                            <Link to="/notifications">
                                <Button className={`w-100 ${activeTab === 10 ? 'active' : ''}`} onClick={() => isOpenSubmenu(10)}>
                                    <span className='icon'><IoMdNotificationsOutline /></span>
                                    Notifications 
                                    <span className='arrow'><FaAngleRight /></span>
                                </Button>
                            </Link>
                        </li>

                        {/* Paramètres */}
                        <li>
                            <Link to="/param">
                                <Button className={`w-100 ${activeTab === 12 ? 'active' : ''}`} onClick={() => isOpenSubmenu(12)}>
                                    <span className='icon'><IoSettingsOutline /></span>
                                    Paramètres 
                                    <span className='arrow'><FaAngleRight /></span>
                                </Button>
                            </Link>
                        </li>
                    </ul>
                </div>

                <div className="logoutWrapper">
                    <div className="logoutBox">
                        <Button variant="contained"><IoMdLogOut /> Déconnexion</Button>
                    </div>
                </div>
            </div>
        </>
    )
}

export default SidBar