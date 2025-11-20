import React, { useState, useEffect } from 'react';
import './BudgetVS.css';
import Breadcrumbs from "@mui/material/Breadcrumbs";
import HomeIcon from "@mui/icons-material/Home";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { 
  IoArrowBackOutline,
  IoSearchOutline,
  IoFilterOutline,
  IoDownloadOutline,
  IoPrintOutline,
  IoRefreshOutline,
  IoStatsChartOutline,
  IoCashOutline,
  IoAlertCircleOutline,
  IoCheckmarkCircleOutline,
  IoTimeOutline,
  IoEyeOutline,
  IoCalendarOutline,
  IoLocationOutline,
  IoPeopleOutline,
  IoDocumentTextOutline
} from "react-icons/io5";
import ScrollToTop from '../../../components/Helper/ScrollToTop';
import Footer from '../../../components/Footer/Footer';
import { Chip, emphasize, styled } from '@mui/material';
import { IoPlayCircleOutline } from "react-icons/io5";
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

interface BudgetStats {
  totalBudgetPrevu: number;
  totalBudgetDepense: number;
  budgetRestant: number;
  tauxUtilisation: number;
  projetsSousBudget: number;
  projetsSurBudget: number;
  projetsDansBudget: number;
}

const BudgetVS: React.FC = () => {
  const navigate = useNavigate();
  const [projets, setProjets] = useState<Projet[]>([]);
  const [filtres, setFiltres] = useState({
    recherche: '',
    type_projet: 'all',
    etat: 'all',
    region: 'all'
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [budgetStats, setBudgetStats] = useState<BudgetStats>({
    totalBudgetPrevu: 0,
    totalBudgetDepense: 0,
    budgetRestant: 0,
    tauxUtilisation: 0,
    projetsSousBudget: 0,
    projetsSurBudget: 0,
    projetsDansBudget: 0
  });
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState<boolean>(false);

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
        budget_depense: 82000000,
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
      }
    ];

    setProjets(mockProjets);
    calculerStatsBudget(mockProjets);
    setLoading(false);
  }, []);

  // Calcul des statistiques budgétaires
  const calculerStatsBudget = (projetsData: Projet[]) => {
    const totalPrevu = projetsData.reduce((sum, p) => sum + p.budget_prevue, 0);
    const totalDepense = projetsData.reduce((sum, p) => sum + p.budget_depense, 0);
    const budgetRestant = totalPrevu - totalDepense;
    const tauxUtilisation = totalPrevu > 0 ? (totalDepense / totalPrevu) * 100 : 0;

    const projetsSousBudget = projetsData.filter(p => p.budget_depense < p.budget_prevue * 0.9).length;
    const projetsSurBudget = projetsData.filter(p => p.budget_depense > p.budget_prevue * 1.1).length;
    const projetsDansBudget = projetsData.filter(p => 
      p.budget_depense >= p.budget_prevue * 0.9 && p.budget_depense <= p.budget_prevue * 1.1
    ).length;

    setBudgetStats({
      totalBudgetPrevu: totalPrevu,
      totalBudgetDepense: totalDepense,
      budgetRestant: budgetRestant,
      tauxUtilisation: tauxUtilisation,
      projetsSousBudget,
      projetsSurBudget,
      projetsDansBudget
    });
  };

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
      projet.reference.toLowerCase().includes(filtres.recherche.toLowerCase());

    const matchesType = filtres.type_projet === 'all' || projet.type_projet === filtres.type_projet;
    const matchesEtat = filtres.etat === 'all' || projet.etat === filtres.etat;
    const matchesRegion = filtres.region === 'all' || projet.region === filtres.region;

    return matchesRecherche && matchesType && matchesEtat && matchesRegion;
  });

  // Formatage du budget
  const formatBudget = (montant: number): string => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(montant);
  };

  // Calcul du pourcentage de budget utilisé par projet
  const calculerPourcentageBudget = (budgetPrevu: number, budgetDepense: number): number => {
    return budgetPrevu > 0 ? (budgetDepense / budgetPrevu) * 100 : 0;
  };

  // Déterminer le statut budgétaire
  const getStatutBudget = (pourcentage: number): string => {
    if (pourcentage < 90) return 'sous-budget';
    if (pourcentage > 110) return 'sur-budget';
    return 'dans-budget';
  };

  // Navigation
  const handleRetour = () => {
    navigate('/projetListes');
  };

  const handleVoirDetails = (projet: Projet): void => {
    navigate(`/detailBudgetVS/${projet.id_projet}`);
  };

  // Options pour les filtres
  const typesProjet = ['infrastructure', 'social', 'formation', 'urgence'];
  const etats = ['planifie', 'en_cours', 'suspendu', 'termine', 'annule'];
  const regions = [...new Set(projets.map(p => p.region))];

  if (loading) {
    return (
      <div className="budget-vs-container">
        <div className="right-content w-100">
          <div className="loading-container">
            <div className="spinner"></div>
            <p>Chargement des données budgétaires...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="budget-vs-container">
      <div className="right-content w-100">
        {/* Header */}
        <div className="card shadow border-0 w-100 flex-row p-4 header-card">
          <div className="header-title">
            <button 
              type="button"
              className="btn-back" 
              onClick={handleRetour}
              aria-label="Retour à la liste des projets"
            >
              <IoArrowBackOutline />
            </button>
            <div>
              <h5 className="mb-0">Budget Consommé vs Prévu</h5>
              <p className="mb-0 subtitle">Analyse comparative des budgets projet</p>
            </div>
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
                label="Budget VS"
                icon={<ExpandMoreIcon fontSize="small" />}
              />
            </Breadcrumbs>
          </div>
        </div>

        {/* Statistiques Globales */}
        <div className="stats-globales">
          <div className="stat-card total">
            <div className="stat-icon">
              <IoCashOutline />
            </div>
            <div className="stat-info">
              <span className="stat-value">{formatBudget(budgetStats.totalBudgetPrevu)}</span>
              <span className="stat-label">Budget Total Prévu</span>
            </div>
          </div>

          <div className="stat-card depense">
            <div className="stat-icon">
              <IoStatsChartOutline />
            </div>
            <div className="stat-info">
              <span className="stat-value">{formatBudget(budgetStats.totalBudgetDepense)}</span>
              <span className="stat-label">Budget Total Dépensé</span>
            </div>
          </div>

          <div className="stat-card restant">
            <div className="stat-icon">
              <IoTimeOutline />
            </div>
            <div className="stat-info">
              <span className="stat-value">{formatBudget(budgetStats.budgetRestant)}</span>
              <span className="stat-label">Budget Restant</span>
            </div>
          </div>

          <div className="stat-card taux">
            <div className="stat-icon">
              <IoDocumentTextOutline />
            </div>
            <div className="stat-info">
              <span className="stat-value">{budgetStats.tauxUtilisation.toFixed(1)}%</span>
              <span className="stat-label">Taux d'Utilisation</span>
            </div>
          </div>
        </div>

        {/* Recherche et Filtres */}
        <div className="bgColor card shadow border-0 p-3 mt-4">
          <div className="search-filter-container">
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

                <div className="action-buttons">
                  <button className="btn-action secondary">
                    <IoRefreshOutline />
                    Actualiser
                  </button>
                  <button className="btn-action secondary">
                    <IoDownloadOutline />
                    Exporter
                  </button>
                  <button className="btn-action secondary">
                    <IoPrintOutline />
                    Imprimer
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Liste des Projets avec Analyse Budgétaire */}
        <div className="bgColor card shadow border-0 p-3 mt-4">
          <div className="projets-budget-list">
            {projetsFiltres.length > 0 ? (
              projetsFiltres.map(projet => {
                const pourcentageBudget = calculerPourcentageBudget(projet.budget_prevue, projet.budget_depense);
                const statutBudget = getStatutBudget(pourcentageBudget);
                const ecartBudget = projet.budget_depense - projet.budget_prevue;

                return (
                  <div key={projet.id_projet} className={`projet-budget-card ${statutBudget}`}>
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
                                {projet.etat.charAt(0).toUpperCase() + projet.etat.slice(1).replace('_', ' ')}
                              </span>
                              
                              <span className={`badge budget-statut ${statutBudget}`}>
                                {statutBudget === 'sous-budget' && <IoCheckmarkCircleOutline />}
                                {statutBudget === 'sur-budget' && <IoAlertCircleOutline />}
                                {statutBudget === 'dans-budget' && <IoTimeOutline />}
                                {statutBudget === 'sous-budget' ? 'Sous Budget' : 
                                 statutBudget === 'sur-budget' ? 'Sur Budget' : 'Dans Budget'}
                              </span>

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
                              {new Date(projet.date_debut_prevue).toLocaleDateString('fr-FR')}
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
                      </div>
                    </div>

                    {/* Analyse Budgétaire Détaillée */}
                    <div className="budget-analysis">
                      <div className="budget-comparison">
                        <div className="budget-item prevu">
                          <span className="budget-label">Budget Prévu</span>
                          <span className="budget-value">{formatBudget(projet.budget_prevue)}</span>
                        </div>
                        
                        <div className="budget-item depense">
                          <span className="budget-label">Budget Dépensé</span>
                          <span className="budget-value">{formatBudget(projet.budget_depense)}</span>
                        </div>

                        <div className={`budget-item ecart ${ecartBudget >= 0 ? 'positif' : 'negatif'}`}>
                          <span className="budget-label">Écart Budgétaire</span>
                          <span className="budget-value">
                            {formatBudget(Math.abs(ecartBudget))} 
                            {ecartBudget >= 0 ? ' (+) ' : ' (-) '}
                          </span>
                        </div>

                        <div className="budget-item pourcentage">
                          <span className="budget-label">Taux d'Utilisation</span>
                          <span className="budget-value">{pourcentageBudget.toFixed(1)}%</span>
                        </div>
                      </div>

                      {/* Barre de progression budget */}
                      <div className="budget-progress-section">
                        <div className="progress-header">
                          <span className="progress-label">Utilisation du Budget</span>
                          <span className="progress-value">{pourcentageBudget.toFixed(1)}%</span>
                        </div>
                        <div className="progress-bar">
                          <div 
                            className={`progress-fill ${statutBudget}`}
                            style={{width: `${Math.min(pourcentageBudget, 100)}%`}}
                          ></div>
                          <div className="budget-seuil seuil-90" style={{left: '90%'}}></div>
                          <div className="budget-seuil seuil-100" style={{left: '100%'}}></div>
                        </div>
                        <div className="progress-labels">
                          <span>0%</span>
                          <span>90%</span>
                          <span>100%</span>
                          <span>110%+</span>
                        </div>
                      </div>

                      {/* Alertes budget */}
                      {statutBudget === 'sur-budget' && (
                        <div className="budget-alert">
                          <IoAlertCircleOutline />
                          <span>Attention: Ce projet dépasse son budget prévu de {formatBudget(ecartBudget)}</span>
                        </div>
                      )}

                      {statutBudget === 'sous-budget' && (
                        <div className="budget-info">
                          <IoCheckmarkCircleOutline />
                          <span>Bon contrôle: Budget respecté avec {formatBudget(Math.abs(ecartBudget))} d'économie</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="no-results">
                <div className="no-results-icon">💰</div>
                <p>Aucun projet trouvé</p>
                <small>Essayez de modifier vos critères de recherche ou de filtre</small>
              </div>
            )}
          </div>
        </div>

        {/* Résumé Analyse */}
        <div className="bgColor card shadow border-0 p-3 mt-4">
          <div className="analyse-resume">
            <h3 className="resume-title">Analyse Budgétaire Globale</h3>
            <div className="resume-grid">
              <div className="resume-item">
                <h4>Performance Budgétaire</h4>
                <p>
                  {budgetStats.tauxUtilisation < 90 ? 'Excellente' : 
                   budgetStats.tauxUtilisation < 100 ? 'Bonne' : 
                   'À surveiller'} gestion budgétaire globale
                </p>
              </div>
              
              <div className="resume-item">
                <h4>Recommandations</h4>
                <ul>
                  {budgetStats.projetsSurBudget > 0 && (
                    <li>🔴 {budgetStats.projetsSurBudget} projet(s) nécessite(nt) une revue budgétaire urgente</li>
                  )}
                  {budgetStats.projetsDansBudget > 0 && (
                    <li>🟢 {budgetStats.projetsDansBudget} projet(s) respecte(nt) leur budget</li>
                  )}
                  {budgetStats.projetsSousBudget > 0 && (
                    <li>🔵 {budgetStats.projetsSousBudget} projet(s) présente(nt) des économies</li>
                  )}
                </ul>
              </div>
              
              <div className="resume-item">
                <h4>Budget Disponible</h4>
                <p className="budget-disponible">
                  {formatBudget(budgetStats.budgetRestant)} restant sur {formatBudget(budgetStats.totalBudgetPrevu)}
                </p>
              </div>
            </div>
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

export default BudgetVS;