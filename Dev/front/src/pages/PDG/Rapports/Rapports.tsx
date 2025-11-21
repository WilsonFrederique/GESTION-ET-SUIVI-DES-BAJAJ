import React from 'react';
import './Rapports.css';
import Breadcrumbs from "@mui/material/Breadcrumbs";
import HomeIcon from "@mui/icons-material/Home";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { IoSearchOutline } from "react-icons/io5";
import ScrollToTop from '../../../components/Helper/ScrollToTop';
import Footer from '../../../components/Footer/Footer';
import { Chip, emphasize, styled } from '@mui/material';

// Définir StyledBreadcrumb comme dans votre premier composant
const StyledBreadcrumb = styled(Chip)(({ theme }) => {
    const backgroundColor =
        theme.palette.mode === "light"
            ? theme.palette.grey[100]
            : theme.palette.grey[800];
    return {
        backgroundColor,
        height: theme.spacing(3),
        color: theme.palette.text.primary,
        fontWeight: theme.typography.fontWeightRegular,
        "&:hover, &:focus": {
            backgroundColor: emphasize(backgroundColor, 0.06),
        },
        "&:active": {
            boxShadow: theme.shadows[1],
            backgroundColor: emphasize(backgroundColor, 0.12),
        },
    };
}) as typeof Chip;

const Rapports: React.FC = () => {

    return (
        <div className="edt-container">
            <div className="right-content w-100">
                <div className="card shadow border-0 w-100 flex-row p-4 header-card">
                    <h5 className="mb-0">Gestion des Projets</h5>
                    <div className="header-controls">
                        <Breadcrumbs aria-label="breadcrumb" className="ms-auto breadcrumb_">
                            <a href="/">
                                <StyledBreadcrumb
                                    className="StyledBreadcrumb"
                                    component="a"
                                    label="Accueil"
                                    icon={<HomeIcon fontSize="small" />}
                                />
                            </a>
                            <StyledBreadcrumb
                                className="StyledBreadcrumb"
                                label="Projets"
                                icon={<ExpandMoreIcon fontSize="small" />}
                            />
                        </Breadcrumbs>
                    </div>
                </div>

                {/* Recherche et Filtres */}
                <div className="card shadow border-0 p-3 mt-4">
                    <div className="search-filter-container">
                        <div className="search-container">
                            <form className="search-form">
                                <input 
                                    type="text" 
                                    className="search-input"
                                    placeholder="Rechercher un projet..."
                                    aria-label="Rechercher un projet"
                                />
                                <button className="search-button" type="button" aria-label="Lancer la recherche">
                                    <IoSearchOutline className="search-icon" />
                                </button>
                            </form>
                        </div>
                    </div>
                </div>

                {/* Container Budget */}
                <div className="card shadow border-0 p-3 mt-4">
                    {/* Container Budget ... */}
                </div>

                <div>
                  <ScrollToTop />
                  <Footer />
                </div>
            </div>
        </div>
    )
}

export default Rapports;