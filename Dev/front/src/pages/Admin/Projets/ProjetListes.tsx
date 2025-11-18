import React, { useState, useEffect } from 'react';
import './ProjetListes.css';
import Breadcrumbs from "@mui/material/Breadcrumbs";
import HomeIcon from "@mui/icons-material/Home";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { 
  IoSearchOutline,
  IoFilterOutline,
  IoAddOutline,
  IoLocationOutline,
  IoCalendarOutline,
  IoCashOutline,
  IoTimeOutline,
  IoAlertCircleOutline,
  IoCheckmarkCircleOutline,
  IoPauseCircleOutline,
  IoPlayCircleOutline,
  IoEyeOutline,
  IoPencilOutline,
  IoDocumentTextOutline,
  IoDownloadOutline,
  IoRefreshOutline,
  IoPeopleOutline,
  IoFlagOutline
} from "react-icons/io5";
import ScrollToTop from '../../../components/Helper/ScrollToTop';
import Footer from '../../../components/Footer/Footer';
import { Chip, emphasize, styled } from '@mui/material';
import { useNavigate } from 'react-router-dom';

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

// Interfaces TypeScript
interface Projet {
  id_projet: number;
  reference: string;
  nom: string;
  description: string;
  type_projet: 'infrastructure' | 'social' | 'formation' | 'urgence';
  localisation: string;
  budget_prevue: number;
  budget_depense: number;
  date_debut_prevue: string;
  date_fin_prevue: string;
  date_debut_reelle: string | null;
  date_fin_reelle: string | null;
  etat: 'planifie' | 'en_cours' | 'suspendu' | 'termine' | 'annule';
  pourcentage_avancement: number;
  priorite: 'basse' | 'moyenne' | 'haute' | 'critique';
  date_creation: string;
  responsable: string;
  region: string;
  est_en_retard: boolean;
}

interface Filtres {
  recherche: string;
  type_projet: string;
  etat: string;
  priorite: string;
  region: string;
  en_retard: string;
}

const ProjetListes: React.FC = () => {
  const navigate = useNavigate();
  const [projets, setProjets] = useState<Projet[]>([]);
  const [filtres, setFiltres] = useState<Filtres>({
    recherche: '',
    type_projet: 'all',
    etat: 'all',
    priorite: 'all',
    region: 'all',
    en_retard: 'all'
  });
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<string>('tous');

  // Données mock basées sur votre structure
  useEffect(() => {
    const mockProjets: Projet[] = [
      {
        id_projet: 1,
        reference: 'PROJ-2024-001',
        nom: 'Construction École Primaire',
        description: 'Construction d\'une école primaire de 6 classes avec équipements modernes',
        type_projet: 'infrastructure',
        localisation: 'Village M\'Bour',
        budget_prevue: 250000000,
        budget_depense: 185000000,
        date_debut_prevue: '2024-01-15',
        date_fin_prevue: '2024-06-30',
        date_debut_reelle: '2024-01-20',
        date_fin_reelle: null,
        etat: 'en_cours',
        pourcentage_avancement: 74,
        priorite: 'haute',
        date_creation: '2023-12-10',
        responsable: 'Jean Dupont',
        region: 'Thiès',
        est_en_retard: false
      },
      {
        id_projet: 2,
        reference: 'PROJ-2024-002',
        nom: 'Formation Agricole Durable',
        description: 'Programme de formation aux techniques agricoles durables pour 500 agriculteurs',
        type_projet: 'formation',
        localisation: 'Région de Fatick',
        budget_prevue: 75000000,
        budget_depense: 68000000,
        date_debut_prevue: '2024-02-01',
        date_fin_prevue: '2024-05-31',
        date_debut_reelle: '2024-02-05',
        date_fin_reelle: null,
        etat: 'en_cours',
        pourcentage_avancement: 85,
        priorite: 'moyenne',
        date_creation: '2023-11-20',
        responsable: 'Marie Fall',
        region: 'Fatick',
        est_en_retard: true
      },
      {
        id_projet: 3,
        reference: 'PROJ-2024-003',
        nom: 'Centre de Santé Communautaire',
        description: 'Construction et équipement d\'un centre de santé pour 10 villages',
        type_projet: 'infrastructure',
        localisation: 'Zone Rurale Kolda',
        budget_prevue: 180000000,
        budget_depense: 180000000,
        date_debut_prevue: '2023-09-01',
        date_fin_prevue: '2024-01-31',
        date_debut_reelle: '2023-09-10',
        date_fin_reelle: '2024-01-25',
        etat: 'termine',
        pourcentage_avancement: 100,
        priorite: 'haute',
        date_creation: '2023-07-15',
        responsable: 'Abdoulaye Diop',
        region: 'Kolda',
        est_en_retard: false
      },
      {
        id_projet: 4,
        reference: 'PROJ-2024-004',
        nom: 'Programme Nutrition Infantile',
        description: 'Lutte contre la malnutrition infantile dans les zones vulnérables',
        type_projet: 'social',
        localisation: 'Département de Matam',
        budget_prevue: 45000000,
        budget_depense: 32000000,
        date_debut_prevue: '2024-03-01',
        date_fin_prevue: '2024-08-31',
        date_debut_reelle: '2024-03-15',
        date_fin_reelle: null,
        etat: 'suspendu',
        pourcentage_avancement: 45,
        priorite: 'critique',
        date_creation: '2024-01-20',
        responsable: 'Aminata Sow',
        region: 'Matam',
        est_en_retard: false
      },
      {
        id_projet: 5,
        reference: 'PROJ-2024-005',
        nom: 'Intervention Urgence Inondations',
        description: 'Aide d\'urgence pour les populations affectées par les inondations',
        type_projet: 'urgence',
        localisation: 'Région de Saint-Louis',
        budget_prevue: 120000000,
        budget_depense: 95000000,
        date_debut_prevue: '2024-01-10',
        date_fin_prevue: '2024-03-31',
        date_debut_reelle: '2024-01-12',
        date_fin_reelle: null,
        etat: 'en_cours',
        pourcentage_avancement: 65,
        priorite: 'critique',
        date_creation: '2024-01-05',
        responsable: 'Moussa Diallo',
        region: 'Saint-Louis',
        est_en_retard: true
      },
      {
        id_projet: 6,
        reference: 'PROJ-2024-006',
        nom: 'Projet Énergie Solaire',
        description: 'Installation de panneaux solaires dans 20 villages isolés',
        type_projet: 'infrastructure',
        localisation: 'Zone de Tambacounda',
        budget_prevue: 95000000,
        budget_depense: 25000000,
        date_debut_prevue: '2024-04-01',
        date_fin_prevue: '2024-09-30',
        date_debut_reelle: null,
        date_fin_reelle: null,
        etat: 'planifie',
        pourcentage_avancement: 0,
        priorite: 'moyenne',
        date_creation: '2024-02-15',
        responsable: 'Ibrahima Ndiaye',
        region: 'Tambacounda',
        est_en_retard: false
      },
      {
        id_projet: 7,
        reference: 'PROJ-2024-007',
        nom: 'Appui aux Femmes Entrepreneures',
        description: 'Formation et financement pour 200 femmes entrepreneures',
        type_projet: 'formation',
        localisation: 'Dakar et Banlieue',
        budget_prevue: 65000000,
        budget_depense: 65000000,
        date_debut_prevue: '2023-11-01',
        date_fin_prevue: '2024-02-29',
        date_debut_reelle: '2023-11-05',
        date_fin_reelle: '2024-02-20',
        etat: 'termine',
        pourcentage_avancement: 100,
        priorite: 'moyenne',
        date_creation: '2023-09-10',
        responsable: 'Fatou Bâ',
        region: 'Dakar',
        est_en_retard: false
      },
      {
        id_projet: 8,
        reference: 'PROJ-2024-008',
        nom: 'Construction Pont Rural',
        description: 'Construction d\'un pont pour désenclaver 5 villages',
        type_projet: 'infrastructure',
        localisation: 'Zone de Kédougou',
        budget_prevue: 320000000,
        budget_depense: 0,
        date_debut_prevue: '2024-05-01',
        date_fin_prevue: '2024-12-31',
        date_debut_reelle: null,
        date_fin_reelle: null,
        etat: 'planifie',
        pourcentage_avancement: 0,
        priorite: 'haute',
        date_creation: '2024-03-01',
        responsable: 'Oumar Sy',
        region: 'Kédougou',
        est_en_retard: false
      }
    ];

    setProjets(mockProjets);
    setLoading(false);
  }, []);

  // Gestion des changements de filtres
  const handleFiltreChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>): void => {
    const { name, value } = e.target;
    setFiltres(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Filtrage des projets
  const projetsFiltres = projets.filter(projet => {
    const matchesRecherche = 
      projet.nom.toLowerCase().includes(filtres.recherche.toLowerCase()) ||
      projet.reference.toLowerCase().includes(filtres.recherche.toLowerCase()) ||
      projet.localisation.toLowerCase().includes(filtres.recherche.toLowerCase()) ||
      projet.description.toLowerCase().includes(filtres.recherche.toLowerCase());

    const matchesType = filtres.type_projet === 'all' || projet.type_projet === filtres.type_projet;
    const matchesEtat = filtres.etat === 'all' || projet.etat === filtres.etat;
    const matchesPriorite = filtres.priorite === 'all' || projet.priorite === filtres.priorite;
    const matchesRegion = filtres.region === 'all' || projet.region === filtres.region;
    const matchesRetard = filtres.en_retard === 'all' || 
      (filtres.en_retard === 'true' && projet.est_en_retard) ||
      (filtres.en_retard === 'false' && !projet.est_en_retard);

    // Filtre par onglet actif
    const matchesTab = activeTab === 'tous' || 
      (activeTab === 'en_cours' && projet.etat === 'en_cours') ||
      (activeTab === 'termines' && projet.etat === 'termine') ||
      (activeTab === 'planifies' && projet.etat === 'planifie') ||
      (activeTab === 'retard' && projet.est_en_retard) ||
      (activeTab === 'region' && projet.region);

    return matchesRecherche && matchesType && matchesEtat && matchesPriorite && matchesRegion && matchesRetard && matchesTab;
  });

  // Options pour les filtres
  const typesProjet = ['infrastructure', 'social', 'formation', 'urgence'];
  const etats = ['planifie', 'en_cours', 'suspendu', 'termine', 'annule'];
  const priorites = ['basse', 'moyenne', 'haute', 'critique'];
  const regions = [...new Set(projets.map(p => p.region))];

  // Navigation
  const handleVoirDetails = (projet: Projet): void => {
    navigate(`/projet/${projet.id_projet}`);
  };

  const handleModifier = (projet: Projet): void => {
    navigate(`/modifier-projet/${projet.id_projet}`, {
      state: { projet }
    });
  };

  // Formatage de la date
  const formatDate = (dateString: string): string => {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric'
    };
    return new Date(dateString).toLocaleDateString('fr-FR', options);
  };

  // Formatage du budget
  const formatBudget = (montant: number): string => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0
    }).format(montant);
  };

  // Calcul du pourcentage de budget utilisé
  const calculerPourcentageBudget = (budgetPrevu: number, budgetDepense: number): number => {
    return budgetPrevu > 0 ? (budgetDepense / budgetPrevu) * 100 : 0;
  };

  // Statistiques globales
  const statistiques = {
    total: projets.length,
    enCours: projets.filter(p => p.etat === 'en_cours').length,
    termines: projets.filter(p => p.etat === 'termine').length,
    enRetard: projets.filter(p => p.est_en_retard).length,
    budgetTotal: projets.reduce((sum, p) => sum + p.budget_prevue, 0),
    budgetDepense: projets.reduce((sum, p) => sum + p.budget_depense, 0)
  };

  if (loading) {
    return (
      <div className="projet-listes-container">
        <div className="right-content w-100">
          <div className="loading-container">
            <div className="spinner"></div>
            <p>Chargement des projets...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="projet-listes-container">
      <div className="right-content w-100">
        {/* Header */}
        <div className="card shadow border-0 w-100 flex-row p-4 header-card">
          <div className="header-title">
            <h5 className="mb-0">Gestion des Projets</h5>
            <p className="mb-0 subtitle">Suivi et monitoring de tous vos projets</p>
          </div>
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

        {/* Statistiques */}
        <div className="stats-container">
          <div className="stat-card">
            <div className="stat-icon total">
              <IoDocumentTextOutline />
            </div>
            <div className="stat-info">
              <span className="stat-number">{statistiques.total}</span>
              <span className="stat-label">Total projets</span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon en-cours">
              <IoPlayCircleOutline />
            </div>
            <div className="stat-info">
              <span className="stat-number">{statistiques.enCours}</span>
              <span className="stat-label">Projets en cours</span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon termines">
              <IoCheckmarkCircleOutline />
            </div>
            <div className="stat-info">
              <span className="stat-number">{statistiques.termines}</span>
              <span className="stat-label">Projets terminés</span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon retard">
              <IoAlertCircleOutline />
            </div>
            <div className="stat-info">
              <span className="stat-number">{statistiques.enRetard}</span>
              <span className="stat-label">Projets en retard</span>
            </div>
          </div>
        </div>

        {/* Navigation par onglets */}
        <div className="tabs-navigation">
          <button 
            className={`tab-button ${activeTab === 'tous' ? 'active' : ''}`}
            onClick={() => setActiveTab('tous')}
          >
            Tous les projets
          </button>
          <button 
            className={`tab-button ${activeTab === 'en_cours' ? 'active' : ''}`}
            onClick={() => setActiveTab('en_cours')}
          >
            Projets en cours
          </button>
          <button 
            className={`tab-button ${activeTab === 'termines' ? 'active' : ''}`}
            onClick={() => setActiveTab('termines')}
          >
            Projets terminés
          </button>
          <button 
            className={`tab-button ${activeTab === 'planifies' ? 'active' : ''}`}
            onClick={() => setActiveTab('planifies')}
          >
            Projets planifiés
          </button>
          <button 
            className={`tab-button ${activeTab === 'retard' ? 'active' : ''}`}
            onClick={() => setActiveTab('retard')}
          >
            Projets en retard
          </button>
          <button 
            className={`tab-button ${activeTab === 'region' ? 'active' : ''}`}
            onClick={() => setActiveTab('region')}
          >
            Projets par région
          </button>
        </div>

        {/* Recherche et Filtres */}
        <div className="bgColor2 card shadow border-0 p-3 mt-4">
          <div className="projet-actions">
            <div className="search-container">
              <div className="search-box">
                <IoSearchOutline className="search-icon" />
                <input
                  type="text"
                  name="recherche"
                  placeholder="Rechercher un projet..."
                  className="search-input"
                  value={filtres.recherche}
                  onChange={handleFiltreChange}
                />
              </div>
            </div>

            <div className="filters-container">
              <button 
                className="mobile-filter-btn"
                onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
              >
                <IoFilterOutline />
                Filtres
              </button>

              <div className={`filter-groups ${mobileFiltersOpen ? 'mobile-open' : ''}`}>
                <div className="filter-group">
                  <select 
                    name="type_projet"
                    value={filtres.type_projet}
                    onChange={handleFiltreChange}
                  >
                    <option value="all">Tous les types</option>
                    {typesProjet.map(type => (
                      <option key={type} value={type}>
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="filter-group">
                  <select 
                    name="etat"
                    value={filtres.etat}
                    onChange={handleFiltreChange}
                  >
                    <option value="all">Tous les états</option>
                    {etats.map(etat => (
                      <option key={etat} value={etat}>
                        {etat.charAt(0).toUpperCase() + etat.slice(1).replace('_', ' ')}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="filter-group">
                  <select 
                    name="priorite"
                    value={filtres.priorite}
                    onChange={handleFiltreChange}
                  >
                    <option value="all">Toutes priorités</option>
                    {priorites.map(priorite => (
                      <option key={priorite} value={priorite}>
                        {priorite.charAt(0).toUpperCase() + priorite.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="filter-group">
                  <select 
                    name="region"
                    value={filtres.region}
                    onChange={handleFiltreChange}
                  >
                    <option value="all">Toutes régions</option>
                    {regions.map(region => (
                      <option key={region} value={region}>{region}</option>
                    ))}
                  </select>
                </div>

                <div className="filter-group">
                  <select 
                    name="en_retard"
                    value={filtres.en_retard}
                    onChange={handleFiltreChange}
                  >
                    <option value="all">Retard</option>
                    <option value="true">En retard</option>
                    <option value="false">Dans les temps</option>
                  </select>
                </div>

                <div className="action-buttons">
                  <a href="/frmProjet">
                    <button className="btn-add-projet">
                      <IoAddOutline />
                      Nouveau Projet
                    </button>
                  </a>
                  <button className="btn-action secondary">
                    <IoRefreshOutline />
                    Actualiser
                  </button>
                  <button className="btn-action secondary">
                    <IoDownloadOutline />
                    Exporter
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Liste des Projets */}
        <div className="bgColor card shadow border-0 p-3 mt-4">
          <div className="projets-list">
            {projetsFiltres.length > 0 ? (
              projetsFiltres.map(projet => (
                <div key={projet.id_projet} className="bgColor2 projet-card">
                  <div className="projet-header">
                    <div className="projet-main-info">
                      <div className="projet-avatar">
                        {projet.type_projet === 'infrastructure' && <IoLocationOutline />}
                        {projet.type_projet === 'social' && <IoPeopleOutline />}
                        {projet.type_projet === 'formation' && <IoDocumentTextOutline />}
                        {projet.type_projet === 'urgence' && <IoAlertCircleOutline />}
                      </div>
                      <div className="projet-title-section">
                        <div className="title-row">
                          <h4 className="projet-title">{projet.nom}</h4>
                          <div className="status-badges">
                            <span className={`badge etat ${projet.etat}`}>
                              {projet.etat === 'en_cours' && <IoPlayCircleOutline />}
                              {projet.etat === 'termine' && <IoCheckmarkCircleOutline />}
                              {projet.etat === 'planifie' && <IoTimeOutline />}
                              {projet.etat === 'suspendu' && <IoPauseCircleOutline />}
                              {projet.etat === 'annule' && <IoAlertCircleOutline />}
                              {projet.etat.charAt(0).toUpperCase() + projet.etat.slice(1).replace('_', ' ')}
                            </span>
                            
                            <span className={`badge priorite ${projet.priorite}`}>
                              <IoFlagOutline />
                              {projet.priorite.charAt(0).toUpperCase() + projet.priorite.slice(1)}
                            </span>

                            {projet.est_en_retard && (
                              <span className="badge retard">
                                <IoAlertCircleOutline />
                                En retard
                              </span>
                            )}

                            <span className="badge reference">
                              {projet.reference}
                            </span>
                          </div>
                        </div>
                        
                        <div className="projet-meta">
                          <span className="localisation">
                            <IoLocationOutline />
                            {projet.localisation} - {projet.region}
                          </span>
                          
                          <span className="responsable">
                            <IoPeopleOutline />
                            {projet.responsable}
                          </span>

                          <span className="dates">
                            <IoCalendarOutline />
                            {formatDate(projet.date_debut_prevue)} - {formatDate(projet.date_fin_prevue)}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="projet-actions">
                      <button 
                        className="btn-action primary"
                        onClick={() => handleVoirDetails(projet)}
                        title="Voir les détails"
                      >
                        <IoEyeOutline />
                        Détails
                      </button>
                      
                      <button 
                        className="btn-action secondary"
                        onClick={() => handleModifier(projet)}
                        title="Modifier"
                      >
                        <IoPencilOutline />
                        Modifier
                      </button>

                      <button 
                        className="btn-action secondary"
                        title="Rapport"
                      >
                        <IoDocumentTextOutline />
                        Rapport
                      </button>
                    </div>
                  </div>

                  {/* Barre de progression et métriques */}
                  <div className="projet-metrics">
                    <div className="progress-section">
                      <div className="progress-header">
                        <span className="progress-label">Avancement du projet</span>
                        <span className="progress-value">{projet.pourcentage_avancement}%</span>
                      </div>
                      <div className="progress-bar">
                        <div 
                          className={`progress-fill ${projet.priorite}`}
                          style={{width: `${projet.pourcentage_avancement}%`}}
                        ></div>
                      </div>
                    </div>

                    <div className="metrics-grid">
                      <div className="metric-item">
                        <div className="metric-icon">
                          <IoCashOutline />
                        </div>
                        <div className="metric-info">
                          <span className="metric-value">{formatBudget(projet.budget_depense)}</span>
                          <span className="metric-label">Dépensé</span>
                          <div className="budget-progress">
                            <div 
                              className="budget-fill"
                              style={{width: `${calculerPourcentageBudget(projet.budget_prevue, projet.budget_depense)}%`}}
                            ></div>
                          </div>
                          <span className="budget-total">sur {formatBudget(projet.budget_prevue)}</span>
                        </div>
                      </div>

                      <div className="metric-item">
                        <div className="metric-icon">
                          <IoCalendarOutline />
                        </div>
                        <div className="metric-info">
                          <span className="metric-value">
                            {projet.date_debut_reelle ? formatDate(projet.date_debut_reelle) : 'Non débuté'}
                          </span>
                          <span className="metric-label">Début réel</span>
                        </div>
                      </div>

                      <div className="metric-item">
                        <div className="metric-icon">
                          <IoTimeOutline />
                        </div>
                        <div className="metric-info">
                          <span className="metric-value">
                            {projet.date_fin_reelle ? formatDate(projet.date_fin_reelle) : 'En cours'}
                          </span>
                          <span className="metric-label">Fin réelle</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="projet-description">
                    <p>{projet.description}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="no-results">
                <div className="no-results-icon">📋</div>
                <p>Aucun projet trouvé</p>
                <small>Essayez de modifier vos critères de recherche ou de filtre</small>
              </div>
            )}
          </div>
        </div>

        <div>
          <ScrollToTop />
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default ProjetListes;