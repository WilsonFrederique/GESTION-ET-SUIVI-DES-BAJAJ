import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './DetailBudgetVS.css';
import Breadcrumbs from "@mui/material/Breadcrumbs";
import HomeIcon from "@mui/icons-material/Home";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { 
  IoArrowBackOutline,
  IoDownloadOutline,
  IoPrintOutline,
  IoRefreshOutline,
  IoStatsChartOutline,
  IoCashOutline,
  IoAlertCircleOutline,
  IoCheckmarkCircleOutline,
  IoTimeOutline,
  IoCalendarOutline,
  IoLocationOutline,
  IoPeopleOutline,
  IoDocumentTextOutline,
  IoPieChartOutline,
  IoBarChartOutline
} from "react-icons/io5";
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

interface DepenseMensuelle {
  mois: string;
  budget_prevue: number;
  budget_depense: number;
}

const DetailBudgetVS: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [projet, setProjet] = useState<Projet | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [depensesMensuelles, setDepensesMensuelles] = useState<DepenseMensuelle[]>([]);

  // Données mock basées sur l'ID
  useEffect(() => {
    const mockProjets: Projet[] = [
      {
        id_projet: 1,
        reference: 'PROJ-2024-001',
        nom: 'Construction École Primaire',
        description: 'Construction d\'une école primaire de 6 classes avec équipements modernes pour améliorer l\'accès à l\'éducation dans la région de Thiès. Le projet comprend la construction de bâtiments, l\'installation de sanitaires et la fourniture de mobilier scolaire.',
        type_projet: 'infrastructure',
        localisation: 'Village M\'Bour, Région de Thiès',
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
        description: 'Programme de formation aux techniques agricoles durables pour 500 agriculteurs de la région de Fatick. Formation sur les méthodes de conservation des sols, l\'irrigation économe et les cultures résistantes.',
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
      }
    ];

    const mockDepenses: DepenseMensuelle[] = [
      { mois: 'Jan 2024', budget_prevue: 40000000, budget_depense: 35000000 },
      { mois: 'Fév 2024', budget_prevue: 45000000, budget_depense: 42000000 },
      { mois: 'Mar 2024', budget_prevue: 50000000, budget_depense: 48000000 },
      { mois: 'Avr 2024', budget_prevue: 55000000, budget_depense: 40000000 },
      { mois: 'Mai 2024', budget_prevue: 35000000, budget_depense: 20000000 },
      { mois: 'Juin 2024', budget_prevue: 25000000, budget_depense: 0 }
    ];

    const projetTrouve = mockProjets.find(p => p.id_projet === parseInt(id || '1'));
    setProjet(projetTrouve || mockProjets[0]);
    setDepensesMensuelles(mockDepenses);
    setLoading(false);
  }, [id]);

  // Formatage du budget
  const formatBudget = (montant: number): string => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(montant);
  };

  // Calcul des statistiques
  const calculerStats = () => {
    if (!projet) return null;

    const pourcentageBudget = (projet.budget_depense / projet.budget_prevue) * 100;
    const ecartBudget = projet.budget_depense - projet.budget_prevue;
    const budgetRestant = projet.budget_prevue - projet.budget_depense;
    const statutBudget = pourcentageBudget < 90 ? 'sous-budget' : pourcentageBudget > 110 ? 'sur-budget' : 'dans-budget';

    return {
      pourcentageBudget,
      ecartBudget,
      budgetRestant,
      statutBudget
    };
  };

  const stats = calculerStats();

  // Navigation
  const handleRetour = () => {
    navigate('/budgetVS');
  };

  const handleExport = () => {
    // Logique d'export
    console.log('Export des données...');
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading || !projet || !stats) {
    return (
      <div className="detail-budget-container">
        <div className="right-content w-100">
          <div className="loading-container">
            <div className="spinner"></div>
            <p>Chargement des détails du projet...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="detail-budget-container">
      <div className="right-content w-100">
        {/* Header */}
        <div className="card shadow border-0 w-100 flex-row p-4 header-card">
          <div className="header-title">
            <button 
              type="button"
              className="btn-back" 
              onClick={handleRetour}
              aria-label="Retour à l'analyse budgétaire"
            >
              <IoArrowBackOutline />
            </button>
            <div>
              <h5 className="mb-0">Détails Budget - {projet.nom}</h5>
              <p className="mb-0 subtitle">Analyse détaillée du budget consommé vs prévu</p>
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
              <a href="/budgetVS">
                <StyledBreadcrumb
                  className="StyledBreadcrumb"
                  label="Budget VS"
                  icon={<ExpandMoreIcon fontSize="small" />}
                />
              </a>
              <StyledBreadcrumb
                className="StyledBreadcrumb"
                label="Détails Budget"
                icon={<ExpandMoreIcon fontSize="small" />}
              />
            </Breadcrumbs>
          </div>
        </div>

        {/* Actions Rapides */}
        <div className="quick-actions">
          <div className="action-buttons">
            <button className="btn-action secondary" onClick={handleExport}>
              <IoDownloadOutline />
              Exporter PDF
            </button>
            <button className="btn-action secondary" onClick={handlePrint}>
              <IoPrintOutline />
              Imprimer
            </button>
            <button className="btn-action secondary" onClick={() => window.location.reload()}>
              <IoRefreshOutline />
              Actualiser
            </button>
          </div>
        </div>

        {/* Informations Générales du Projet */}
        <div className="card shadow border-0 p-4 mt-4 projet-info-card">
          <div className="projet-header-info">
            <div className="projet-avatar large">
              {projet.type_projet === 'infrastructure' && <IoLocationOutline />}
              {projet.type_projet === 'social' && <IoPeopleOutline />}
              {projet.type_projet === 'formation' && <IoDocumentTextOutline />}
              {projet.type_projet === 'urgence' && <IoAlertCircleOutline />}
            </div>
            <div className="projet-main-info">
              <h2 className="projet-title">{projet.nom}</h2>
              <p className="projet-description">{projet.description}</p>
              <div className="projet-meta-grid">
                <div className="meta-item">
                  <IoLocationOutline />
                  <span>{projet.localisation}</span>
                </div>
                <div className="meta-item">
                  <IoPeopleOutline />
                  <span>Responsable: {projet.responsable}</span>
                </div>
                <div className="meta-item">
                  <IoCalendarOutline />
                  <span>Début: {new Date(projet.date_debut_prevue).toLocaleDateString('fr-FR')}</span>
                </div>
                <div className="meta-item">
                  <IoCalendarOutline />
                  <span>Fin prévue: {new Date(projet.date_fin_prevue).toLocaleDateString('fr-FR')}</span>
                </div>
              </div>
            </div>
            <div className="projet-status">
              <span className={`status-badge etat ${projet.etat}`}>
                {projet.etat.charAt(0).toUpperCase() + projet.etat.slice(1).replace('_', ' ')}
              </span>
              <span className={`status-badge priorite ${projet.priorite}`}>
                Priorité: {projet.priorite}
              </span>
              <span className="status-badge reference">
                {projet.reference}
              </span>
            </div>
          </div>
        </div>

        {/* Graphique d'évolution */}
        <div className="mt-4 mb-4 bgColor card shadow border-0 p-4 chart-card">
            <div className="card-header">
            <h4 className="card-title">
                <IoBarChartOutline />
                Évolution Mensuelle du Budget
            </h4>
            </div>
            <div className="chart-container">
            <div className="bars-container">
                {depensesMensuelles.map((depense, index) => {
                const pourcentagePrevu = (depense.budget_prevue / projet.budget_prevue) * 100;
                const pourcentageDepense = (depense.budget_depense / projet.budget_depense) * 100;
                
                return (
                    <div key={index} className="bar-group">
                    <div className="bar-label">{depense.mois}</div>
                    <div className="bars">
                        <div 
                        className="bar prevue" 
                        style={{height: `${Math.min(pourcentagePrevu, 100)}%`}}
                        title={`Prévu: ${formatBudget(depense.budget_prevue)}`}
                        ></div>
                        <div 
                        className="bar depense" 
                        style={{height: `${Math.min(pourcentageDepense, 100)}%`}}
                        title={`Dépensé: ${formatBudget(depense.budget_depense)}`}
                        ></div>
                    </div>
                    </div>
                );
                })}
            </div>
            <div className="chart-legend">
                <div className="legend-item">
                <div className="color-box prevue"></div>
                <span>Budget Prévu</span>
                </div>
                <div className="legend-item">
                <div className="color-box depense"></div>
                <span>Budget Dépensé</span>
                </div>
            </div>
            </div>
        </div>
        
        {/* Répartition du budget */}
        <div className="mb-4 bgColor card shadow border-0 p-4 repartition-card">
            <div className="card-header">
            <h4 className="card-title">
                <IoPieChartOutline />
                Répartition du Budget
            </h4>
            </div>
            <div className="repartition-content">
            <div className="pie-chart-placeholder">
                <div className="pie-chart">
                <div 
                    className="pie-segment depense" 
                    style={{'--percentage': `${stats.pourcentageBudget}%`} as React.CSSProperties}
                ></div>
                <div 
                    className="pie-segment restant" 
                    style={{'--percentage': `${100 - stats.pourcentageBudget}%`} as React.CSSProperties}
                ></div>
                <div className="pie-center">
                    <span className="pie-value">{stats.pourcentageBudget.toFixed(1)}%</span>
                    <span className="pie-label">Utilisé</span>
                </div>
                </div>
            </div>
            <div className="repartition-details">
                <div className="detail-item depense">
                <div className="detail-color"></div>
                <div className="detail-info">
                    <span className="detail-value">{formatBudget(projet.budget_depense)}</span>
                    <span className="detail-label">Budget Dépensé ({stats.pourcentageBudget.toFixed(1)}%)</span>
                </div>
                </div>
                <div className="detail-item restant">
                <div className="detail-color"></div>
                <div className="detail-info">
                    <span className="detail-value">{formatBudget(stats.budgetRestant)}</span>
                    <span className="detail-label">Budget Restant ({(100 - stats.pourcentageBudget).toFixed(1)}%)</span>
                </div>
                </div>
                <div className="detail-item total">
                <div className="detail-color"></div>
                <div className="detail-info">
                    <span className="detail-value">{formatBudget(projet.budget_prevue)}</span>
                    <span className="detail-label">Budget Total Prévu</span>
                </div>
                </div>
            </div>
            </div>
        </div>

        {/* Alertes et Recommandations */}
        <div className="mb-4 bgColor card shadow border-0 p-4 alert-card">
          <div className="card-header">
            <h4 className="card-title">
              <IoAlertCircleOutline />
              Analyse et Recommandations
            </h4>
          </div>
          <div className="alert-content">
            {stats.statutBudget === 'sur-budget' && (
              <div className="alert severe">
                <IoAlertCircleOutline />
                <div className="alert-text">
                  <h5>Dépassement Budgétaire</h5>
                  <p>Le projet a dépassé son budget prévu de {formatBudget(stats.ecartBudget)}. 
                  Il est recommandé de revoir les dépenses et de mettre en place des mesures de contrôle.</p>
                </div>
              </div>
            )}
            
            {stats.statutBudget === 'sous-budget' && (
              <div className="alert positive">
                <IoCheckmarkCircleOutline />
                <div className="alert-text">
                  <h5>Bon Contrôle Budgétaire</h5>
                  <p>Le projet respecte son budget avec {formatBudget(Math.abs(stats.ecartBudget))} d'économie. 
                  Le taux d'utilisation est de {stats.pourcentageBudget.toFixed(1)}%.</p>
                </div>
              </div>
            )}

            {stats.statutBudget === 'dans-budget' && (
              <div className="alert info">
                <IoTimeOutline />
                <div className="alert-text">
                  <h5>Budget Dans les Normes</h5>
                  <p>Le projet utilise {stats.pourcentageBudget.toFixed(1)}% de son budget prévu. 
                  La gestion budgétaire est conforme aux attentes.</p>
                </div>
              </div>
            )}

            {/* Recommandations spécifiques */}
            <div className="recommendations">
              <h6>Recommandations:</h6>
              <ul>
                {stats.pourcentageBudget > 100 && (
                  <>
                    <li>🔴 Réviser les postes de dépenses principaux</li>
                    <li>🔴 Mettre en place un contrôle renforcé des engagements</li>
                    <li>🔴 Évaluer la nécessité d'une rallonge budgétaire</li>
                  </>
                )}
                {stats.pourcentageBudget <= 100 && stats.pourcentageBudget > 80 && (
                  <>
                    <li>🟡 Surveiller les dépenses des prochains mois</li>
                    <li>🟡 Anticiper les risques de dépassement</li>
                  </>
                )}
                {stats.pourcentageBudget <= 80 && (
                  <>
                    <li>🟢 Continuer le suivi régulier</li>
                    <li>🟢 Maintenir la discipline budgétaire</li>
                  </>
                )}
              </ul>
            </div>
          </div>
        </div>

        {/* Détails Techniques */}
        <div className="mb-4 bgColor card shadow border-0 p-4 technical-card">
          <div className="card-header">
            <h4 className="card-title">Détails Techniques</h4>
          </div>
          <div className="technical-grid">
            <div className="technical-item">
              <label>Avancement Physique:</label>
              <span className="value">{projet.pourcentage_avancement}%</span>
            </div>
            <div className="technical-item">
              <label>Avancement Financier:</label>
              <span className="value">{stats.pourcentageBudget.toFixed(1)}%</span>
            </div>
            <div className="technical-item">
              <label>Écart Budgétaire:</label>
              <span className={`value ${stats.ecartBudget >= 0 ? 'negative' : 'positive'}`}>
                {formatBudget(Math.abs(stats.ecartBudget))} 
                {stats.ecartBudget >= 0 ? ' (Dépassement)' : ' (Économie)'}
              </span>
            </div>
            <div className="technical-item">
              <label>Statut:</label>
              <span className={`value status-${projet.etat}`}>
                {projet.etat.charAt(0).toUpperCase() + projet.etat.slice(1).replace('_', ' ')}
              </span>
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

export default DetailBudgetVS;