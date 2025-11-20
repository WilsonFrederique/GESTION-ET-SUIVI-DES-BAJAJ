import React, { useState, useEffect } from 'react';
import './Dashboard.css';
import Breadcrumbs from "@mui/material/Breadcrumbs";
import HomeIcon from "@mui/icons-material/Home";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { 
  IoSearchOutline,
  IoAddOutline,
  IoEyeOutline,
  IoDownloadOutline,
  IoRefreshOutline,
  IoCalendarOutline,
  IoPeopleOutline,
  IoTimeOutline,
  IoAlertCircleOutline,
  IoCheckmarkCircleOutline,
  IoPlayCircleOutline,
  IoBusinessOutline,
  IoCashOutline,
  IoCarSportOutline,
  IoDocumentsOutline,
  IoSettingsOutline,
  IoAnalyticsOutline,
  IoArrowUpOutline,
  IoArrowDownOutline,
  IoStatsChartOutline,
  IoTrendingUpOutline,
  IoWalletOutline,
  IoPieChartOutline
} from "react-icons/io5";
import { CiMoneyBill } from "react-icons/ci";
import ScrollToTop from '../../Helper/ScrollToTop';
import Footer from '../../Footer/Footer';
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
interface DashboardStats {
  rentabiliteGlobale: number;
  roiParBajaj: number;
  tauxExpansion: number;
  tresorerie: number;
  investissements: number;
  margesBeneficiaires: number;
  performanceVehicules: number;
  tauxUtilisation: number;
  validationsEnAttente: number;
  budgetsApprouves: number;
  bilanGlobal: number;
  acquisitionsPlanifiees: number;
}

interface RapportRecent {
  id: number;
  titre: string;
  type: 'mensuel' | 'strategique' | 'compte_rendu';
  date: string;
  statut: 'termine' | 'en_cours' | 'en_retard';
  auteur: string;
}

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats>({
    rentabiliteGlobale: 0,
    roiParBajaj: 0,
    tauxExpansion: 0,
    tresorerie: 0,
    investissements: 0,
    margesBeneficiaires: 0,
    performanceVehicules: 0,
    tauxUtilisation: 0,
    validationsEnAttente: 0,
    budgetsApprouves: 0,
    bilanGlobal: 0,
    acquisitionsPlanifiees: 0
  });

  const [rapportsRecents, setRapportsRecents] = useState<RapportRecent[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Données mock pour le dashboard transport
  useEffect(() => {
    const mockStats: DashboardStats = {
      rentabiliteGlobale: 24.5,
      roiParBajaj: 18.2,
      tauxExpansion: 12.8,
      tresorerie: 185000000,
      investissements: 45000000,
      margesBeneficiaires: 32.5,
      performanceVehicules: 87.3,
      tauxUtilisation: 76.4,
      validationsEnAttente: 8,
      budgetsApprouves: 12,
      bilanGlobal: 94.2,
      acquisitionsPlanifiees: 15
    };

    const mockRapports: RapportRecent[] = [
      {
        id: 1,
        titre: 'Rapport Mensuel Performance Flotte',
        type: 'mensuel',
        date: '2024-03-15',
        statut: 'termine',
        auteur: 'Directeur Général'
      },
      {
        id: 2,
        titre: 'Analyse Stratégique Expansion Régionale',
        type: 'strategique',
        date: '2024-03-10',
        statut: 'en_cours',
        auteur: 'Comité Stratégique'
      },
      {
        id: 3,
        titre: 'Compte Rendu Acquisition Véhicules',
        type: 'compte_rendu',
        date: '2024-03-08',
        statut: 'termine',
        auteur: 'Directeur Flotte'
      },
      {
        id: 4,
        titre: 'Rapport Financier Trimestriel',
        type: 'mensuel',
        date: '2024-03-05',
        statut: 'en_retard',
        auteur: 'Directeur Financier'
      },
      {
        id: 5,
        titre: 'Plan d\'Investissement 2024-2025',
        type: 'strategique',
        date: '2024-03-01',
        statut: 'en_cours',
        auteur: 'PDG'
      }
    ];

    setStats(mockStats);
    setRapportsRecents(mockRapports);
    setLoading(false);
  }, []);

  const formatMontant = (montant: number): string => {
    if (montant >= 1000000) {
      return `${(montant / 1000000).toFixed(1)}M XOF`;
    }
    if (montant >= 1000) {
      return `${(montant / 1000).toFixed(0)}K XOF`;
    }
    return `${montant} XOF`;
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  // Filtrage des rapports récents
  const rapportsFiltres = rapportsRecents.filter(rapport =>
    rapport.titre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    rapport.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    rapport.auteur.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Composant de carte de statistique
  const StatCard = ({ 
    title, 
    value, 
    icon, 
    color = 'primary',
    trend,
    suffix = '',
    prefix = '',
    description = ''
  }: {
    title: string;
    value: number | string;
    icon: React.ReactNode;
    color?: 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'accent' | 'purple';
    trend?: number;
    suffix?: string;
    prefix?: string;
    description?: string;
  }) => (
    <div className={`stat-card ${color}`}>
      <div className="stat-header">
        <div className="stat-icon-wrapper">
          {icon}
        </div>
        <div className="stat-trend-indicator">
          {trend !== undefined && (
            <span className={`trend ${trend >= 0 ? 'positive' : 'negative'}`}>
              {trend >= 0 ? <IoArrowUpOutline /> : <IoArrowDownOutline />}
              {Math.abs(trend)}%
            </span>
          )}
        </div>
      </div>
      <div className="stat-content">
        <div className="stat-value">
          {prefix}{value}{suffix}
        </div>
        <div className="stat-title">{title}</div>
        {description && <div className="stat-description">{description}</div>}
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="loading-spinner"></div>
        <p>Chargement du tableau de bord...</p>
      </div>
    );
  }

  return (
    <div className="dashboard-modern">
      <div className="dashboard-content">
        {/* Header avec Breadcrumbs */}
        <div className="dashboard-header">
          <div className="header-content">
            <div className="header-text">
              <h1 className="dashboard-title">Tableau de Bord Stratégique</h1>
              <p className="dashboard-subtitle">Vue d'ensemble complète des performances et indicateurs clés de votre entreprise</p>
            </div>
            <div className="header-breadcrumbs">
              <Breadcrumbs aria-label="breadcrumb">
                <a href="/">
                  <StyledBreadcrumb
                    component="a"
                    label="Accueil"
                    icon={<HomeIcon fontSize="small" />}
                  />
                </a>
                <StyledBreadcrumb
                  label="Tableau de Bord PDG"
                  icon={<ExpandMoreIcon fontSize="small" />}
                />
              </Breadcrumbs>
            </div>
          </div>
        </div>

        {/* Barre de recherche et actions rapides */}
        <div className="dashboard-controls">
          <div className="search-section">
            <div className="search-wrapper">
              <IoSearchOutline className="search-icon" />
              <input
                type="text"
                placeholder="Rechercher un rapport, une analyse..."
                className="search-input"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="actions-section">
            <button className="action-btn primary">
              <IoAddOutline />
              Nouveau Rapport
            </button>
            <button className="action-btn secondary">
              <IoDownloadOutline />
              Exporter
            </button>
            <button className="action-btn secondary">
              <IoRefreshOutline />
              Actualiser
            </button>
          </div>
        </div>

        {/* 📊 Section Tableau de Bord Stratégique */}
        <section className="dashboard-section">
          <div className="section-header">
            <IoAnalyticsOutline className="section-icon" />
            <h2 className="section-title">Tableau de Bord Stratégique</h2>
          </div>
          <div className="stats-grid-2x2">
            <StatCard
              title="Rentabilité Globale"
              value={stats.rentabiliteGlobale}
              suffix="%"
              icon={<IoPieChartOutline />}
              color="success"
              trend={2.4}
              description="Croissance trimestrielle"
            />
            <StatCard
              title="ROI par Bajaj"
              value={stats.roiParBajaj}
              suffix="%"
              icon={<CiMoneyBill />}
              color="primary"
              trend={1.2}
              description="Retour sur investissement"
            />
            <StatCard
              title="Taux d'Expansion"
              value={stats.tauxExpansion}
              suffix="%"
              icon={<IoTrendingUpOutline />}
              color="accent"
              trend={3.1}
              description="Nouvelles zones couvertes"
            />
            <StatCard
              title="Prévisions Financières"
              value="+15%"
              icon={<IoStatsChartOutline />}
              color="info"
              trend={15}
              description="Projection annuelle"
            />
          </div>
        </section>

        {/* 💰 Section Finances */}
        <section className="dashboard-section">
          <div className="section-header">
            <IoCashOutline className="section-icon" />
            <h2 className="section-title">Finances</h2>
          </div>
          <div className="stats-grid-2x2">
            <StatCard
              title="Bilan Global"
              value={stats.bilanGlobal}
              suffix="%"
              icon={<IoCheckmarkCircleOutline />}
              color="success"
              description="Performance financière"
            />
            <StatCard
              title="Trésorerie"
              value={formatMontant(stats.tresorerie)}
              icon={<IoWalletOutline />}
              color="primary"
              description="Disponibilités actuelles"
            />
            <StatCard
              title="Investissements"
              value={formatMontant(stats.investissements)}
              icon={<IoBusinessOutline />}
              color="info"
              description="Capitaux engagés"
            />
            <StatCard
              title="Marges Bénéficiaires"
              value={stats.margesBeneficiaires}
              suffix="%"
              icon={<IoAnalyticsOutline />}
              color="accent"
              trend={1.8}
              description="Profitabilité"
            />
          </div>
        </section>

        {/* 🚗 Section Flotte */}
        <section className="dashboard-section">
          <div className="section-header">
            <IoCarSportOutline className="section-icon" />
            <h2 className="section-title">Flotte</h2>
          </div>
          <div className="stats-grid-2x2">
            <StatCard
              title="Performance Véhicules"
              value={stats.performanceVehicules}
              suffix="%"
              icon={<IoCarSportOutline />}
              color="primary"
              trend={2.3}
              description="Efficacité opérationnelle"
            />
            <StatCard
              title="Taux d'Utilisation"
              value={stats.tauxUtilisation}
              suffix="%"
              icon={<IoTimeOutline />}
              color="info"
              trend={1.1}
              description="Optimisation des ressources"
            />
            <StatCard
              title="Acquisitions Planifiées"
              value={stats.acquisitionsPlanifiees}
              icon={<IoAddOutline />}
              color="accent"
              description="Nouveaux véhicules"
            />
            <StatCard
              title="Maintenance"
              value="92%"
              icon={<IoSettingsOutline />}
              color="success"
              description="Taux de disponibilité"
            />
          </div>
        </section>

        {/* Contenu principal avec grille responsive */}
        <div className="main-content-grid">
          {/* 📈 Section Rapports Récents */}
          <div className="content-column main-column">
            <div className="content-card">
              <div className="card-header">
                <div className="card-title-section">
                  <IoDocumentsOutline className="card-icon" />
                  <h3 className="card-title">Rapports Récents</h3>
                </div>
                <button className="view-all-btn">
                  Voir tout <IoEyeOutline />
                </button>
              </div>
              
              <div className="rapports-container">
                {rapportsFiltres.length > 0 ? (
                  rapportsFiltres.map(rapport => (
                    <div key={rapport.id} className="rapport-card">
                      <div className="rapport-content">
                        <div className="rapport-header">
                          <h4 className="rapport-title">{rapport.titre}</h4>
                          <span className={`rapport-status ${rapport.statut}`}>
                            {rapport.statut === 'termine' && <IoCheckmarkCircleOutline />}
                            {rapport.statut === 'en_cours' && <IoPlayCircleOutline />}
                            {rapport.statut === 'en_retard' && <IoAlertCircleOutline />}
                            {rapport.statut.replace('_', ' ')}
                          </span>
                        </div>
                        <div className="rapport-meta">
                          <span className="rapport-type">
                            {rapport.type === 'mensuel' && '📊 Mensuel PDG'}
                            {rapport.type === 'strategique' && '🎯 Analyse Stratégique'}
                            {rapport.type === 'compte_rendu' && '📋 Compte Rendu DG'}
                          </span>
                          <span className="rapport-author">Par {rapport.auteur}</span>
                        </div>
                        <div className="rapport-date">
                          <IoCalendarOutline />
                          {formatDate(rapport.date)}
                        </div>
                      </div>
                      <div className="rapport-actions">
                        <button className="icon-btn primary" title="Voir">
                          <IoEyeOutline />
                        </button>
                        <button className="icon-btn secondary" title="Télécharger">
                          <IoDownloadOutline />
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="no-results">
                    <p>Aucun rapport trouvé pour votre recherche</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* ⚙️ Section Administration */}
          <div className="content-column sidebar-column">
            <div className="content-card">
              <div className="card-header">
                <div className="card-title-section">
                  <IoSettingsOutline className="card-icon" />
                  <h3 className="card-title">Administration</h3>
                </div>
              </div>
              
              <div className="admin-container">
                <div className="admin-item">
                  <div className="admin-icon warning">
                    <IoDocumentsOutline />
                  </div>
                  <div className="admin-content">
                    <p className="admin-title">{stats.validationsEnAttente} validations en attente</p>
                    <p className="admin-subtitle">Stratégies nécessitant approbation</p>
                    <span className="admin-badge urgent">Action requise</span>
                  </div>
                  <button className="admin-action-btn">
                    Vérifier
                  </button>
                </div>

                <div className="admin-item">
                  <div className="admin-icon success">
                    <IoCheckmarkCircleOutline />
                  </div>
                  <div className="admin-content">
                    <p className="admin-title">{stats.budgetsApprouves} budgets approuvés</p>
                    <p className="admin-subtitle">Ce mois</p>
                    <span className="admin-badge">Dernière approbation: Aujourd'hui</span>
                  </div>
                  <button className="admin-action-btn outline">
                    Détails
                  </button>
                </div>

                <div className="admin-item">
                  <div className="admin-icon info">
                    <IoPeopleOutline />
                  </div>
                  <div className="admin-content">
                    <p className="admin-title">Supervision DG</p>
                    <p className="admin-subtitle">Réunion trimestrielle programmée</p>
                    <span className="admin-badge">15 Mars 2024</span>
                  </div>
                  <button className="admin-action-btn">
                    Planifier
                  </button>
                </div>

                <div className="admin-item">
                  <div className="admin-icon accent">
                    <IoAnalyticsOutline />
                  </div>
                  <div className="admin-content">
                    <p className="admin-title">Rapport de performance</p>
                    <p className="admin-subtitle">DG à examiner</p>
                    <span className="admin-badge warning">Échéance: 20 Mars</span>
                  </div>
                  <button className="admin-action-btn warning">
                    Examiner
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Indicateurs de Performance */}
        <section className="performance-section">
          <div className="content-card">
            <div className="section-header">
              <IoAnalyticsOutline className="section-icon" />
              <h2 className="section-title">Indicateurs de Performance Stratégiques</h2>
            </div>
            <div className="performance-grid">
              <div className="performance-item">
                <div className="performance-value success">94%</div>
                <div className="performance-label">Satisfaction Clients</div>
                <div className="performance-trend positive">
                  <IoArrowUpOutline /> +2.1%
                </div>
              </div>
              <div className="performance-item">
                <div className="performance-value primary">88%</div>
                <div className="performance-label">Efficacité Opérationnelle</div>
                <div className="performance-trend positive">
                  <IoArrowUpOutline /> +1.4%
                </div>
              </div>
              <div className="performance-item">
                <div className="performance-value info">92%</div>
                <div className="performance-label">Disponibilité Flotte</div>
                <div className="performance-trend positive">
                  <IoArrowUpOutline /> +0.8%
                </div>
              </div>
              <div className="performance-item">
                <div className="performance-value accent">96%</div>
                <div className="performance-label">Conformité Réglementaire</div>
                <div className="performance-trend positive">
                  <IoArrowUpOutline /> +1.2%
                </div>
              </div>
            </div>
          </div>
        </section>

        <div>
          <ScrollToTop />
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;