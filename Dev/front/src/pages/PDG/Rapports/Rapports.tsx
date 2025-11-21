import React, { useState } from 'react';
import './Rapports.css';
import Breadcrumbs from "@mui/material/Breadcrumbs";
import HomeIcon from "@mui/icons-material/Home";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { IoSearchOutline } from "react-icons/io5";
import { FaFilePdf, FaDownload, FaChartLine, FaUserTie, FaBuilding } from "react-icons/fa";
import { MdDateRange } from "react-icons/md";
import ScrollToTop from '../../../components/Helper/ScrollToTop';
import Footer from '../../../components/Footer/Footer';
import { Chip, emphasize, styled } from '@mui/material';

// Définir StyledBreadcrumb
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

// Types pour les rapports
interface Rapport {
    id: number;
    type: 'mensuel' | 'strategique' | 'compte-rendu';
    titre: string;
    description: string;
    date: string;
    taille: string;
    statut: 'complet' | 'partiel' | 'en-cours';
    donnees: {
        recettes: number;
        depenses: number;
        benefice: number;
        tucTucActifs: number;
    };
}

const Rapports: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState<'all' | 'mensuel' | 'strategique' | 'compte-rendu'>('all');
    const [selectedRapport, setSelectedRapport] = useState<Rapport | null>(null);

    // Données simulées basées sur les fichiers PDF
    const rapports: Rapport[] = [
        {
            id: 1,
            type: 'mensuel',
            titre: 'Rapport Mensuel PDG - Décembre 2024',
            description: 'Analyse complète des performances financières et opérationnelles du mois',
            date: '15/12/2024',
            taille: '2.4 MB',
            statut: 'complet',
            donnees: {
                recettes: 38460000,
                depenses: 21650000,
                benefice: 16810000,
                tucTucActifs: 15
            }
        },
        {
            id: 2,
            type: 'strategique',
            titre: 'Analyse Stratégique - Expansion Flotte',
            description: 'Plan d\'expansion et analyse de rentabilité pour nouvelle acquisition',
            date: '10/12/2024',
            taille: '1.8 MB',
            statut: 'complet',
            donnees: {
                recettes: 45820000,
                depenses: 28900000,
                benefice: 16920000,
                tucTucActifs: 20
            }
        },
        {
            id: 3,
            type: 'compte-rendu',
            titre: 'Compte Rendu DG - Réunion Trimestrielle',
            description: 'Synthèse des décisions et orientations stratégiques',
            date: '05/12/2024',
            taille: '1.2 MB',
            statut: 'partiel',
            donnees: {
                recettes: 31250000,
                depenses: 19800000,
                benefice: 11450000,
                tucTucActifs: 12
            }
        },
        {
            id: 4,
            type: 'mensuel',
            titre: 'Rapport Mensuel PDG - Novembre 2024',
            description: 'Performance mensuelle avec focus sur la maintenance',
            date: '15/11/2024',
            taille: '2.1 MB',
            statut: 'complet',
            donnees: {
                recettes: 35180000,
                depenses: 20450000,
                benefice: 14730000,
                tucTucActifs: 14
            }
        }
    ];

    const filteredRapports = rapports.filter(rapport => {
        const matchesSearch = rapport.titre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            rapport.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesType = filterType === 'all' || rapport.type === filterType;
        return matchesSearch && matchesType;
    });

    const getTypeIcon = (type: string) => {
        switch (type) {
            case 'mensuel': return <FaChartLine className="rapport-type-icon mensuel" />;
            case 'strategique': return <FaBuilding className="rapport-type-icon strategique" />;
            case 'compte-rendu': return <FaUserTie className="rapport-type-icon compte-rendu" />;
            default: return <FaFilePdf className="rapport-type-icon" />;
        }
    };

    const getTypeLabel = (type: string) => {
        switch (type) {
            case 'mensuel': return 'Mensuel PDG';
            case 'strategique': return 'Analyse Stratégique';
            case 'compte-rendu': return 'Compte Rendu DG';
            default: return type;
        }
    };

    const getStatutClass = (statut: string) => {
        switch (statut) {
            case 'complet': return 'statut-complet';
            case 'partiel': return 'statut-partiel';
            case 'en-cours': return 'statut-en-cours';
            default: return '';
        }
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('fr-MG', {
            style: 'currency',
            currency: 'MGA',
            minimumFractionDigits: 0
        }).format(amount);
    };

    return (
        <div className="moderne-rapports-container">
            <div className="moderne-right-content w-100">
                {/* Header avec Breadcrumbs */}
                <div className="header moderne-administration-header">
                    <div className="moderne-header-content">
                        <div className="moderne-header-text">
                            <div className="moderne-header-title-content">
                                <h1 className="moderne-dashboard-title">
                                    Tableau de <span className="moderne-highlight">Bord Rapports</span>
                                </h1>
                                <p className="moderne-dashboard-subtitle">
                                    Analyse complète et rapports détaillés de votre flotte de Tuc Tuc électriques
                                </p>
                            </div>
                        </div>
                    </div>
                    
                    <div className="moderne-header-breadcrumbs">
                        <Breadcrumbs aria-label="breadcrumb">
                        <a href="/">
                            <StyledBreadcrumb
                            component="a"
                            label="Accueil"
                            icon={<HomeIcon fontSize="small" />}
                            />
                        </a>
                        <StyledBreadcrumb
                            label="Finances"
                            icon={<ExpandMoreIcon fontSize="small" />}
                        />
                        </Breadcrumbs>
                    </div>
                </div>

                {/* Statistiques Rapides */}
                <div className="moderne-stats-grid">
                    <div className="moderne-stat-card revenue">
                        <div className="moderne-stat-icon">
                            <FaChartLine />
                        </div>
                        <div className="moderne-stat-content">
                            <h3>{formatCurrency(45820000)}</h3>
                            <p>Recettes Mensuelles</p>
                        </div>
                    </div>
                    <div className="moderne-stat-card expense">
                        <div className="moderne-stat-icon">
                            <FaFilePdf />
                        </div>
                        <div className="moderne-stat-content">
                            <h3>{formatCurrency(28900000)}</h3>
                            <p>Dépenses Mensuelles</p>
                        </div>
                    </div>
                    <div className="moderne-stat-card profit">
                        <div className="moderne-stat-icon">
                            <FaBuilding />
                        </div>
                        <div className="moderne-stat-content">
                            <h3>{formatCurrency(16920000)}</h3>
                            <p>Bénéfice Net</p>
                        </div>
                    </div>
                    <div className="moderne-stat-card vehicles">
                        <div className="moderne-stat-icon">
                            <FaUserTie />
                        </div>
                        <div className="moderne-stat-content">
                            <h3>20</h3>
                            <p>Tuc Tuc Actifs</p>
                        </div>
                    </div>
                </div>

                {/* Recherche et Filtres */}
                <div className="moderne-card shadow border-0 p-4 mt-4">
                    <div className="moderne-search-filter-container">
                        <div className="moderne-search-container">
                            <form className="moderne-search-form">
                                <input 
                                    type="text" 
                                    className="moderne-search-input"
                                    placeholder="Rechercher un rapport..."
                                    aria-label="Rechercher un rapport"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                                <button className="moderne-search-button" type="button" aria-label="Lancer la recherche">
                                    <IoSearchOutline className="moderne-search-icon" />
                                </button>
                            </form>
                        </div>
                        
                        <div className="moderne-filter-container">
                            <select 
                                className="moderne-filter-select"
                                value={filterType}
                                onChange={(e) => setFilterType(e.target.value as any)}
                            >
                                <option value="all">Tous les types</option>
                                <option value="mensuel">Mensuel PDG</option>
                                <option value="strategique">Analyse Stratégique</option>
                                <option value="compte-rendu">Compte Rendu DG</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Liste des Rapports */}
                <div className="moderne-card shadow border-0 p-4 mt-4">
                    <div className="moderne-rapports-header">
                        <h6 className="moderne-mb-0">Rapports Disponibles</h6>
                        <span className="moderne-rapports-count">{filteredRapports.length} rapport(s)</span>
                    </div>

                    <div className="moderne-rapports-list">
                        {filteredRapports.map(rapport => (
                            <div key={rapport.id} className="moderne-rapport-card2">
                                <div className="moderne-rapport-main">
                                    <div className="moderne-rapport-type">
                                        {getTypeIcon(rapport.type)}
                                        <span className="moderne-type-label">{getTypeLabel(rapport.type)}</span>
                                        <span className={`moderne-statut-badge ${getStatutClass(rapport.statut)}`}>
                                            {rapport.statut}
                                        </span>
                                    </div>
                                    
                                    <div className="moderne-rapport-info">
                                        <h6 className="moderne-rapport-titre">{rapport.titre}</h6>
                                        <p className="moderne-rapport-description">{rapport.description}</p>
                                        
                                        <div className="moderne-rapport-meta">
                                            <span className="moderne-meta-item">
                                                <MdDateRange className="moderne-meta-icon" />
                                                {rapport.date}
                                            </span>
                                            <span className="moderne-meta-item">
                                                <FaFilePdf className="moderne-meta-icon" />
                                                {rapport.taille}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="moderne-rapport-actions">
                                    <button className="moderne-btn-action view" onClick={() => setSelectedRapport(rapport)}>
                                        <FaChartLine />
                                        Voir Détails
                                    </button>
                                    <button className="moderne-btn-action download">
                                        <FaDownload />
                                        Télécharger
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {filteredRapports.length === 0 && (
                        <div className="moderne-no-results">
                            <FaFilePdf className="moderne-no-results-icon" />
                            <p>Aucun rapport trouvé</p>
                        </div>
                    )}
                </div>

                {/* Modal de Détails */}
                {selectedRapport && (
                    <div className="moderne-modal-overlay" onClick={() => setSelectedRapport(null)}>
                        <div className="moderne-modal-content" onClick={(e) => e.stopPropagation()}>
                            <div className="moderne-modal-header">
                                <h5>{selectedRapport.titre}</h5>
                                <button className="moderne-close-btn" onClick={() => setSelectedRapport(null)}>×</button>
                            </div>
                            
                            <div className="moderne-modal-body">
                                <div className="moderne-rapport-details">
                                    <div className="moderne-detail-section">
                                        <h6>Informations Générales</h6>
                                        <div className="moderne-detail-grid">
                                            <div className="moderne-detail-item">
                                                <span className="moderne-detail-label">Type:</span>
                                                <span className="moderne-detail-value">{getTypeLabel(selectedRapport.type)}</span>
                                            </div>
                                            <div className="moderne-detail-item">
                                                <span className="moderne-detail-label">Date:</span>
                                                <span className="moderne-detail-value">{selectedRapport.date}</span>
                                            </div>
                                            <div className="moderne-detail-item">
                                                <span className="moderne-detail-label">Statut:</span>
                                                <span className={`moderne-detail-value ${getStatutClass(selectedRapport.statut)}`}>
                                                    {selectedRapport.statut}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="moderne-detail-section">
                                        <h6>Données Financières</h6>
                                        <div className="moderne-financial-grid">
                                            <div className="moderne-financial-item revenue">
                                                <span className="moderne-financial-label">Recettes</span>
                                                <span className="moderne-financial-value">
                                                    {formatCurrency(selectedRapport.donnees.recettes)}
                                                </span>
                                            </div>
                                            <div className="moderne-financial-item expense">
                                                <span className="moderne-financial-label">Dépenses</span>
                                                <span className="moderne-financial-value">
                                                    {formatCurrency(selectedRapport.donnees.depenses)}
                                                </span>
                                            </div>
                                            <div className="moderne-financial-item profit">
                                                <span className="moderne-financial-label">Bénéfice</span>
                                                <span className="moderne-financial-value">
                                                    {formatCurrency(selectedRapport.donnees.benefice)}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="moderne-detail-section">
                                        <h6>Flotte</h6>
                                        <div className="moderne-fleet-info">
                                            <span className="moderne-fleet-count">
                                                {selectedRapport.donnees.tucTucActifs} Tuc Tuc actifs
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="moderne-modal-footer">
                                <button className="moderne-btn-secondary" onClick={() => setSelectedRapport(null)}>
                                    Fermer
                                </button>
                                <button className="moderne-btn-primary">
                                    <FaDownload />
                                    Télécharger le PDF
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                <div>
                    <ScrollToTop />
                    <Footer />
                </div>
            </div>
        </div>
    );
};

export default Rapports;